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
  /**
   * Pins cells of the GAT grid (the x and y the game shows). With several, each pin carries its
   * number. The camera flies to the cell at `focus`, or fits them all when `focus` is left out.
   */
  setMarkers: (cells: { x: number; y: number }[], focus?: number) => void;
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

  // Location markers: a pin over each GAT cell with a pulsing ring around its foot. When there
  // are several, every pin carries its number.
  let markers: THREE.Group | null = null;
  const rings: THREE.Mesh[] = [];
  const pins: THREE.Group[] = [];
  let frame = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const markerScale = Math.max(1, mapWidth / 600);

  const clearMarkers = () => {
    cancelAnimationFrame(frame);
    if (!markers) return;
    scene.remove(markers);
    markers.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      } else if (object instanceof THREE.Sprite) {
        object.material.map?.dispose();
        object.material.dispose();
      }
    });
    markers = null;
    rings.length = 0;
    pins.length = 0;
  };

  const tick = (time: number) => {
    if (disposed || !rings.length) return;
    const t = (time % 1600) / 1600;
    for (const ring of rings) {
      ring.scale.setScalar(1 + t * 1.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - t);
    }
    pins.forEach((pin, i) => {
      pin.position.y = Math.sin(time / 300 + i) * 1.5 * markerScale;
    });
    render();
    frame = requestAnimationFrame(tick);
  };

  /** A round orange badge with a number, drawn once on a small canvas. */
  const numberBadge = (n: number, scale: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fd6c01";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(64, 64, 54, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 72px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n), 64, 70);
    }
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), depthTest: false, transparent: true }),
    );
    sprite.scale.set(16 * scale, 16 * scale, 1);
    sprite.position.y = 24 * scale;
    sprite.renderOrder = 6;
    return sprite;
  };

  /** Where a cell is in the scene, or null when the cell is off the map. */
  const cellPoint = (cell: { x: number; y: number }): THREE.Vector3 | null => {
    if (cell.x < 0 || cell.y < 0 || cell.x >= gat.width || cell.y >= gat.height) return null;
    const size = gnd.zoom / 2;
    const i = cell.x + cell.y * gat.width;
    const ground = -(gat.cellHeights[i * 4] + gat.cellHeights[i * 4 + 1] + gat.cellHeights[i * 4 + 2] + gat.cellHeights[i * 4 + 3]) / 4;
    return new THREE.Vector3((cell.x + 0.5) * size, ground, -(cell.y + 0.5) * size);
  };

  const setMarkers = (cells: { x: number; y: number }[], focus?: number) => {
    clearMarkers();
    const points = cells.map(cellPoint);
    const placed = points.flatMap((point, index) => (point ? [{ point, index }] : []));
    if (!placed.length) {
      render();
      return;
    }

    // with many pins the camera stands further back, so they are drawn bigger to stay readable
    const s = markerScale * (cells.length > 1 ? 1.8 : 1);
    const orange = 0xfd6c01;
    markers = new THREE.Group();
    scene.add(markers);
    for (const { point, index } of placed) {
      const solid = new THREE.MeshBasicMaterial({ color: orange, depthTest: false });
      const marker = new THREE.Group();
      marker.position.copy(point);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(5 * s, 7 * s, 48).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: orange, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthTest: false }),
      );
      ring.position.y = 0.6;
      ring.renderOrder = 3;

      const pin = new THREE.Group();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(3 * s, 9 * s, 24).rotateX(Math.PI), solid);
      cone.position.y = 4.5 * s;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(4.2 * s, 24, 16), solid);
      ball.position.y = 11 * s;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(1.6 * s, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }));
      dot.position.y = 11 * s;
      dot.position.z = 3 * s;
      for (const part of [cone, ball, dot]) part.renderOrder = 4;
      pin.add(cone, ball, dot);
      if (cells.length > 1) pin.add(numberBadge(index + 1, s));

      marker.add(ring, pin);
      markers.add(marker);
      rings.push(ring);
      pins.push(pin);
    }

    // Fly the camera to the pin in focus, or high enough to take them all in.
    const focused = focus !== undefined ? points[focus] : null;
    let target: THREE.Vector3;
    let distance: number;
    if (focused) {
      target = focused;
      distance = Math.max(120, mapWidth * 0.2);
    } else if (placed.length === 1) {
      target = placed[0].point;
      distance = Math.max(120, mapWidth * 0.2);
    } else {
      const box = new THREE.Box3().setFromPoints(placed.map((p) => p.point));
      target = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      distance = Math.max(160, Math.max(size.x, size.z) * 1.3);
    }
    controls.target.copy(target);
    camera.position.set(target.x, target.y + distance, target.z + distance * 0.45);
    controls.update();

    if (reduceMotion) {
      for (const ring of rings) {
        ring.scale.setScalar(1.6);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.7;
      }
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
    setMarkers,
    resize,
    texturesLoaded,
    objectsLoaded: mapObjects ? mapObjects.ready : Promise.resolve(0),
    hasMapLight: mapLight !== null,
    setMapLight,
    dispose: () => {
      mapObjects?.dispose();
      disposed = true;
      clearMarkers();
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
