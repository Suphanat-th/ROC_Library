import * as THREE from "three";
import { parseRsm, type RsmData } from "@/utils/rsmParser";
import type { RswData } from "@/utils/rswParser";
import type { GndData } from "@/utils/gndParser";

export interface MapObjects {
  /** Every placed model. Hidden until its pieces are ready. */
  group: THREE.Group;
  /** Resolves with how many models were placed. */
  ready: Promise<number>;
  dispose: () => void;
}

interface ObjectsSource {
  rsw: RswData;
  /** folder of the model files, e.g. /assets/sprite_data/model */
  modelBase: string;
  /** folder of the picture files, e.g. /assets/sprite_data/texture */
  textureBase: string;
}

const DEGREES = Math.PI / 180;

/** The game's file names use backslashes and may differ in case from the files on the site. */
function pathCandidates(name: string): string[] {
  const path = name.replaceAll("\\", "/");
  return [...new Set([path, path.toLowerCase()])].map((p) => p.split("/").map(encodeURIComponent).join("/"));
}

async function fetchFirst(base: string, name: string): Promise<Response | null> {
  for (const candidate of pathCandidates(name)) {
    const response = await fetch(`${base}/${candidate}`).catch(() => null);
    if (response?.ok) return response;
  }
  return null;
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

/** A model picture; the pure magenta of the game's pictures stands for "see through". */
async function loadModelTexture(base: string, name: string): Promise<THREE.Texture | null> {
  for (const candidate of pathCandidates(name)) {
    const image = await loadImage(`${base}/${candidate}`);
    if (!image) continue;
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > 230 && px[i + 1] < 40 && px[i + 2] > 230) px[i + 3] = 0;
    }
    ctx.putImageData(data, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }
  return null;
}

/**
 * Turns a model into one piece of geometry per picture it uses, in the game's own axes
 * (y points down), standing on y = 0 and centred on x and z.
 */
function buildPieces(rsm: RsmData): Map<number, THREE.BufferGeometry> {
  const byName = new Map(rsm.nodes.map((node) => [node.name, node]));
  const chains = new Map<string, THREE.Matrix4>();
  const chainOf = (node: (typeof rsm.nodes)[number], depth = 0): THREE.Matrix4 => {
    const cached = chains.get(node.name);
    if (cached) return cached;
    const axis = new THREE.Vector3(...node.rotationAxis);
    const rotation = new THREE.Quaternion();
    if (axis.lengthSq() > 0 && node.rotationAngle !== 0) rotation.setFromAxisAngle(axis.normalize(), node.rotationAngle);
    const local = new THREE.Matrix4().compose(new THREE.Vector3(...node.position), rotation, new THREE.Vector3(...node.scale));
    const parent = node.parent ? byName.get(node.parent) : undefined;
    const chain = parent && parent !== node && depth < 16 ? chainOf(parent, depth + 1).clone().multiply(local) : local;
    chains.set(node.name, chain);
    return chain;
  };

  const positions = new Map<number, number[]>();
  const uvs = new Map<number, number[]>();
  const box = new THREE.Box3();
  const point = new THREE.Vector3();

  for (const node of rsm.nodes) {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = node.offsetMatrix;
    const offset = new THREE.Matrix4().set(
      m0, m3, m6, node.offset[0],
      m1, m4, m7, node.offset[1],
      m2, m5, m8, node.offset[2],
      0, 0, 0, 1,
    );
    const full = chainOf(node).clone().multiply(offset);
    for (const face of node.faces) {
      const texture = node.textureIds[face.texture] ?? -1;
      const out = positions.get(texture) ?? [];
      const outUv = uvs.get(texture) ?? [];
      for (let k = 0; k < 3; k++) {
        const v = face.vertices[k] * 3;
        point.set(node.vertices[v], node.vertices[v + 1], node.vertices[v + 2]).applyMatrix4(full);
        box.expandByPoint(point);
        out.push(point.x, point.y, point.z);
        const t = face.texCoords[k] * 2;
        outUv.push(node.texCoords[t], 1 - node.texCoords[t + 1]);
      }
      positions.set(texture, out);
      uvs.set(texture, outUv);
    }
  }

  // Stand the model on y = 0 (the bottom is the largest y) and centre it on x and z.
  const center = box.getCenter(new THREE.Vector3());
  const pieces = new Map<number, THREE.BufferGeometry>();
  for (const [texture, values] of positions) {
    for (let i = 0; i < values.length; i += 3) {
      values[i] -= center.x;
      values[i + 1] -= box.max.y;
      values[i + 2] -= center.z;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs.get(texture) ?? [], 2));
    geometry.computeVertexNormals();
    pieces.set(texture, geometry);
  }
  return pieces;
}

/**
 * Places the models of a map (the .rsw file) as still objects. Models used many times share
 * one piece of geometry, drawn as many instances.
 */
export function createMapObjects(source: ObjectsSource, gnd: GndData, isDisposed: () => boolean, onChange: () => void): MapObjects {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const textures = new Map<string, Promise<THREE.Texture | null>>();
  const textureOf = (name: string) => {
    let texture = textures.get(name);
    if (!texture) {
      texture = loadModelTexture(source.textureBase, name);
      textures.set(name, texture);
    }
    return texture;
  };

  const flip = new THREE.Matrix4().makeScale(1, -1, -1);
  const halfWidth = (gnd.width * gnd.zoom) / 2;
  const halfDepth = (gnd.height * gnd.zoom) / 2;
  const instancesOf = (file: string) => source.rsw.models.filter((m) => m.file === file);

  const placeModel = async (file: string): Promise<number> => {
    const response = await fetchFirst(source.modelBase, file);
    if (!response || isDisposed()) return 0;
    let rsm: RsmData;
    try {
      rsm = parseRsm(await response.arrayBuffer());
    } catch {
      return 0;
    }
    const instances = instancesOf(file);
    const matrices = instances.map((model) => {
      const translate = new THREE.Matrix4().makeTranslation(model.position[0] + halfWidth, model.position[1], model.position[2] + halfDepth);
      const rotate = new THREE.Matrix4()
        .makeRotationZ(model.rotation[2] * DEGREES)
        .multiply(new THREE.Matrix4().makeRotationX(model.rotation[0] * DEGREES))
        .multiply(new THREE.Matrix4().makeRotationY(model.rotation[1] * DEGREES));
      const scale = new THREE.Matrix4().makeScale(...model.scale);
      return flip.clone().multiply(translate).multiply(rotate).multiply(scale);
    });

    for (const [textureId, geometry] of buildPieces(rsm)) {
      const map = textureId >= 0 ? await textureOf(rsm.textures[textureId] ?? "") : null;
      if (isDisposed()) return 0;
      const material = new THREE.MeshLambertMaterial({
        map,
        color: map ? 0xffffff : 0x9aa0a8,
        alphaTest: 0.5,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
      matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      group.add(mesh);
      disposables.push(geometry, material);
    }
    onChange();
    return instances.length;
  };

  const files = [...new Set(source.rsw.models.map((m) => m.file))];
  const ready = Promise.all(files.map(placeModel)).then((counts) => {
    onChange();
    return counts.reduce((sum, n) => sum + n, 0);
  });

  return {
    group,
    ready,
    dispose: () => {
      for (const item of disposables) item.dispose();
      for (const texture of textures.values()) texture.then((t) => t?.dispose());
      group.clear();
    },
  };
}
