import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GndData } from "@/utils/gndParser";
import { isWalkableGatType, type GatData } from "@/utils/gatParser";
import type { RswData } from "@/utils/rswParser";
import { createMapObjects } from "./mapObjects";

export type ColorMode = "map" | "texture";

export interface MapScene {
  setMode: (mode: ColorMode) => void;
  setShowWalkable: (show: boolean) => void;
  setShowEdges: (show: boolean) => void;
  /** Pins a cell of the GAT grid (the x and y the game shows) and flies the camera to it; null removes the pin. */
  setMarker: (cell: { x: number; y: number } | null) => void;
  resize: () => void;
  /** Resolves with how many ground pictures were found next to the map files. */
  texturesLoaded: Promise<number>;
  /** Resolves with how many models (buildings, walls, trees...) were placed. */
  objectsLoaded: Promise<number>;
  /** True when the map file says how it is lit, so the map's own light can be used. */
  hasMapLight: boolean;
  /** Light the scene as the map is lit (true) or evenly and brightly (false). */
  setMapLight: (on: boolean) => void;
  dispose: () => void;
}

interface Group {
  position: number[];
  uv: number[];
  light: number[];
  y: number[];
}

const DEGREES = Math.PI / 180;

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
  objects?: { rsw: RswData; modelBase: string },
): MapScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x10151c);
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  scene.add(ambientLight);
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

  // Buildings, walls, trees and the like from the .rsw file. They are shown with the real
  // pictures, so they follow the "real surface" mode and stay hidden on the black map.
  const mapObjects = objects
    ? createMapObjects({ rsw: objects.rsw, modelBase: objects.modelBase, textureBase }, gnd, () => disposed, () => render())
    : null;
  if (mapObjects) scene.add(mapObjects.group);

  // The map's own light. The game multiplies pictures by the light as it is (no gamma), so the
  // colours are read as sRGB values; the lights are scaled by PI to match three.js's units.
  const mapLight = objects?.rsw.light ?? null;
  const setMapLight = (on: boolean) => {
    if (on && mapLight) {
      const { longitude, latitude, diffuse, ambient } = mapLight;
      const lon = longitude * DEGREES;
      const lat = latitude * DEGREES;
      ambientLight.color.setRGB(ambient[0], ambient[1], ambient[2], THREE.SRGBColorSpace);
      ambientLight.intensity = Math.PI;
      sun.color.setRGB(diffuse[0], diffuse[1], diffuse[2], THREE.SRGBColorSpace);
      sun.intensity = Math.PI;
      // from overhead (latitude 0) tilting towards the compass direction (longitude)
      sun.position.set(Math.cos(lon) * Math.sin(lat), Math.cos(lat), -Math.sin(lon) * Math.sin(lat)).multiplyScalar(1000);
    } else {
      ambientLight.color.set(0xffffff);
      ambientLight.intensity = 1.6;
      sun.color.set(0xffffff);
      sun.intensity = 1.6;
      sun.position.set(-1, 2, 1);
    }
    render();
  };
  setMapLight(true);

  let mode: ColorMode = "map";
  const applyMode = () => {
    if (mapObjects) mapObjects.group.visible = mode === "texture";
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

  // Location marker: a pin over one GAT cell with a pulsing ring around its foot.
  let marker: THREE.Group | null = null;
  let ring: THREE.Mesh | null = null;
  let pin: THREE.Group | null = null;
  let frame = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const markerScale = Math.max(1, mapWidth / 600);

  const clearMarker = () => {
    cancelAnimationFrame(frame);
    if (!marker) return;
    scene.remove(marker);
    marker.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      }
    });
    marker = null;
    ring = null;
    pin = null;
  };

  const tick = (time: number) => {
    if (disposed || !ring || !pin) return;
    const t = (time % 1600) / 1600;
    ring.scale.setScalar(1 + t * 1.6);
    (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - t);
    pin.position.y = Math.sin(time / 300) * 1.5 * markerScale;
    render();
    frame = requestAnimationFrame(tick);
  };

  const setMarker = (cell: { x: number; y: number } | null) => {
    clearMarker();
    if (!cell || cell.x < 0 || cell.y < 0 || cell.x >= gat.width || cell.y >= gat.height) {
      render();
      return;
    }
    const size = gnd.zoom / 2;
    const i = cell.x + cell.y * gat.width;
    const ground = -(gat.cellHeights[i * 4] + gat.cellHeights[i * 4 + 1] + gat.cellHeights[i * 4 + 2] + gat.cellHeights[i * 4 + 3]) / 4;
    const x = (cell.x + 0.5) * size;
    const z = -(cell.y + 0.5) * size;

    const s = markerScale;
    const orange = 0xfd6c01;
    const solid = new THREE.MeshBasicMaterial({ color: orange, depthTest: false });
    marker = new THREE.Group();
    marker.position.set(x, ground, z);

    ring = new THREE.Mesh(
      new THREE.RingGeometry(5 * s, 7 * s, 48).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: orange, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthTest: false }),
    );
    ring.position.y = 0.6;
    ring.renderOrder = 3;

    pin = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(3 * s, 9 * s, 24).rotateX(Math.PI), solid);
    cone.position.y = 4.5 * s;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(4.2 * s, 24, 16), solid);
    ball.position.y = 11 * s;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(1.6 * s, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }));
    dot.position.y = 11 * s;
    dot.position.z = 3 * s;
    for (const part of [cone, ball, dot]) part.renderOrder = 4;
    pin.add(cone, ball, dot);

    marker.add(ring, pin);
    scene.add(marker);

    // Fly the camera over the spot, high enough to see the neighbourhood around it.
    const distance = Math.max(120, mapWidth * 0.2);
    controls.target.set(x, ground, z);
    camera.position.set(x, ground + distance, z + distance * 0.45);
    controls.update();

    if (reduceMotion) {
      ring.scale.setScalar(1.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.7;
      render();
    } else {
      frame = requestAnimationFrame(tick);
    }
  };

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
    setMarker,
    resize,
    texturesLoaded,
    objectsLoaded: mapObjects ? mapObjects.ready : Promise.resolve(0),
    hasMapLight: mapLight !== null,
    setMapLight,
    dispose: () => {
      mapObjects?.dispose();
      disposed = true;
      clearMarker();
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
