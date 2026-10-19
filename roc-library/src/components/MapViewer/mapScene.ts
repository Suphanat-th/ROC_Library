import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GndData } from "@/utils/gndParser";
import { isWalkableGatType, type GatData } from "@/utils/gatParser";

export type ColorMode = "map" | "texture";

export interface MapScene {
  setMode: (mode: ColorMode) => void;
  setShowWalkable: (show: boolean) => void;
  setShowEdges: (show: boolean) => void;
  resize: () => void;
  /** Resolves with how many ground pictures were found next to the map files. */
  texturesLoaded: Promise<number>;
  dispose: () => void;
}

interface Group {
  position: number[];
  uv: number[];
  light: number[];
  y: number[];
}

// Corner order of every surface and cell: bottom-left, bottom-right, top-left, top-right.
const TRIANGLES = [0, 1, 2, 1, 3, 2];

function lightLevel(gnd: GndData, surface: number): number {
  const map = gnd.surfaceLightmap[surface];
  if (map < 0 || map >= gnd.lightmapCount) return 1;
  let sum = 0;
  const start = map * 256;
  for (let i = 0; i < 64; i++) sum += gnd.lightmaps[start + i];
  return 0.35 + (0.65 * sum) / (64 * 255);
}

function buildTerrainGroups(gnd: GndData): Group[] {
  const groups: Group[] = Array.from({ length: Math.max(1, gnd.textures.length) }, () => ({
    position: [], uv: [], light: [], y: [],
  }));
  const { zoom, width, height } = gnd;

  const addQuad = (surface: number, corners: [number, number, number][]) => {
    const group = groups[gnd.surfaceTexture[surface]] ?? groups[0];
    const light = lightLevel(gnd, surface);
    for (const index of TRIANGLES) {
      const [cx, cy, h] = corners[index];
      group.position.push(cx * zoom, -h, -cy * zoom);
      group.uv.push(gnd.surfaceU[surface * 4 + index], 1 - gnd.surfaceV[surface * 4 + index]);
      group.light.push(light, light, light);
      group.y.push(-h);
    }
  };

  for (let cy = 0; cy < height; cy++) {
    for (let cx = 0; cx < width; cx++) {
      const cell = cx + cy * width;
      const h = gnd.cellHeights.subarray(cell * 4, cell * 4 + 4);

      const top = gnd.cellTop[cell];
      if (top >= 0) {
        addQuad(top, [[cx, cy, h[0]], [cx + 1, cy, h[1]], [cx, cy + 1, h[2]], [cx + 1, cy + 1, h[3]]]);
      }

      const front = gnd.cellFront[cell];
      if (front >= 0 && cy + 1 < height) {
        const n = gnd.cellHeights.subarray((cell + width) * 4, (cell + width) * 4 + 4);
        addQuad(front, [[cx, cy + 1, h[2]], [cx + 1, cy + 1, h[3]], [cx, cy + 1, n[0]], [cx + 1, cy + 1, n[1]]]);
      }

      const right = gnd.cellRight[cell];
      if (right >= 0 && cx + 1 < width) {
        const n = gnd.cellHeights.subarray((cell + 1) * 4, (cell + 1) * 4 + 4);
        addQuad(right, [[cx + 1, cy + 1, h[3]], [cx + 1, cy, h[1]], [cx + 1, cy + 1, n[2]], [cx + 1, cy, n[0]]]);
      }
    }
  }
  return groups;
}

function buildWalkableMesh(gnd: GndData, gat: GatData): THREE.Mesh | null {
  const size = gnd.zoom / 2;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const walkable = [0.55, 0.75, 0.9];

  for (let cy = 0; cy < gat.height; cy++) {
    for (let cx = 0; cx < gat.width; cx++) {
      // Skip cells above empty ground so the overlay does not float in the void.
      const gndCell = (cx >> 1) + (cy >> 1) * gnd.width;
      if (gnd.cellTop[gndCell] < 0) continue;

      const cell = cx + cy * gat.width;
      const h = gat.cellHeights.subarray(cell * 4, cell * 4 + 4);
      if (!isWalkableGatType(gat.cellTypes[cell])) continue;
      const base = positions.length / 3;
      const corners: [number, number, number][] = [[cx, cy, h[0]], [cx + 1, cy, h[1]], [cx, cy + 1, h[2]], [cx + 1, cy + 1, h[3]]];
      for (const [x, y, height] of corners) {
        positions.push(x * size, -height + 0.3, -y * size);
        colors.push(...walkable);
      }
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }
  if (!indices.length) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 1;
  return mesh;
}

function loadTexture(loader: THREE.TextureLoader, base: string, name: string): Promise<THREE.Texture | null> {
  const path = name.replaceAll("\\", "/");
  const candidates = [...new Set([path, path.toLowerCase()])];
  const attempt = (i: number): Promise<THREE.Texture | null> =>
    i >= candidates.length
      ? Promise.resolve(null)
      : new Promise((resolve) => {
          loader.load(
            `${base}/${candidates[i]}`,
            (texture) => resolve(texture),
            undefined,
            () => resolve(attempt(i + 1)),
          );
        });
  return attempt(0);
}

export function createMapScene(
  container: HTMLElement,
  gnd: GndData,
  gat: GatData,
  textureBase: string,
): MapScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x10151c);
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-1, 2, 1);
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(50, 1, 5, 30000);
  const mapWidth = gnd.width * gnd.zoom;
  const mapDepth = gnd.height * gnd.zoom;
  const center = new THREE.Vector3(mapWidth / 2, 0, -mapDepth / 2);
  // Start almost straight above the map, like the in-game mini map.
  camera.position.set(center.x, mapWidth * 1.05, center.z + mapDepth * 0.2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(center);
  controls.minDistance = 40;
  controls.maxDistance = mapWidth * 2;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;
  controls.screenSpacePanning = false;
  controls.update();

  let disposed = false;
  const render = () => {
    if (!disposed) renderer.render(scene, camera);
  };
  controls.addEventListener("change", render);

  // Terrain
  const groups = buildTerrainGroups(gnd);

  interface TerrainPart {
    mesh: THREE.Mesh;
    material: THREE.MeshLambertMaterial;
    mapColor: Float32Array;
    lightColor: Float32Array;
    texture: THREE.Texture | null;
  }
  const parts: TerrainPart[] = [];
  groups.forEach((group) => {
    if (!group.y.length) return;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(group.position, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(group.uv, 2));
    const lightColor = new Float32Array(group.light);
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(lightColor), 3));
    geometry.computeVertexNormals();
    const material = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    parts.push({ mesh, material, mapColor: new Float32Array(lightColor.length).fill(0.03), lightColor, texture: null });
  });
  // `groups` skips empty ones, so remember which texture each part came from.
  const partTextureIds: number[] = [];
  groups.forEach((group, id) => {
    if (group.y.length) partTextureIds.push(id);
  });

  const walkableMesh = buildWalkableMesh(gnd, gat);
  if (walkableMesh) {
    walkableMesh.visible = false;
    scene.add(walkableMesh);
  }

  // Outline of every ground and wall edge so the layout reads on the black map; built on first use.
  let edges: THREE.Group | null = null;
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x5b6674 });
  const setEdges = (show: boolean) => {
    if (show && !edges) {
      edges = new THREE.Group();
      for (const part of parts) {
        edges.add(new THREE.LineSegments(new THREE.EdgesGeometry(part.mesh.geometry, 20), edgeMaterial));
      }
      scene.add(edges);
    }
    if (edges) edges.visible = show;
    render();
  };

  let mode: ColorMode = "map";
  const applyMode = () => {
    for (const part of parts) {
      const attribute = part.mesh.geometry.getAttribute("color") as THREE.BufferAttribute;
      attribute.array.set(mode === "map" ? part.mapColor : part.lightColor);
      attribute.needsUpdate = true;
      const map = mode === "texture" ? part.texture : null;
      if (part.material.map !== map) {
        part.material.map = map;
        part.material.needsUpdate = true;
      }
    }
    render();
  };

  // Ground pictures are optional: parts without one keep the light colours.
  const loader = new THREE.TextureLoader();
  const texturesLoaded = Promise.all(
    partTextureIds.map(async (id, i) => {
      const name = gnd.textures[id];
      const texture = name ? await loadTexture(loader, textureBase, name) : null;
      if (texture && !disposed) {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        parts[i].texture = texture;
      }
      return texture ? 1 : 0;
    }),
  ).then((found) => {
    const count = found.reduce<number>((sum, n) => sum + n, 0);
    if (!disposed) applyMode();
    return count;
  });

  const resize = () => {
    const { clientWidth, clientHeight } = container;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    render();
  };
  resize();
  applyMode();

  return {
    setMode: (next) => {
      mode = next;
      applyMode();
    },
    setShowWalkable: (show) => {
      if (walkableMesh) walkableMesh.visible = show;
      render();
    },
    setShowEdges: setEdges,
    resize,
    texturesLoaded,
    dispose: () => {
      disposed = true;
      controls.dispose();
      edges?.children.forEach((line) => (line as THREE.LineSegments).geometry.dispose());
      edgeMaterial.dispose();
      for (const part of parts) {
        part.mesh.geometry.dispose();
        part.material.dispose();
        part.texture?.dispose();
      }
      if (walkableMesh) {
        walkableMesh.geometry.dispose();
        (walkableMesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
