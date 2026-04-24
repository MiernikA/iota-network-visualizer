import * as THREE from "three";
import type { ValidatorGlobePoint } from "../data/useValidatorGlobePoints";
import type { GlobeInstance } from "../../../../../types/globe/scene";
import {
  CLOUDS_TEXTURE_URL,
  EARTH_BLUE_MARBLE_URL,
  EARTH_TOPOLOGY_URL,
  EARTH_WATER_URL,
} from "../assets/constants";
import { createValidatorObject } from "./createValidatorObject";

type SetupGlobeSceneParams = {
  mountNode: HTMLDivElement;
  points: ValidatorGlobePoint[];
  onObjectHover: (_point: ValidatorGlobePoint | null) => void;
};

type SetupGlobeSceneResult = {
  globe: GlobeInstance;
  clouds: THREE.Mesh;
};

export async function setupGlobeScene({
  mountNode,
  points,
  onObjectHover,
}: SetupGlobeSceneParams): Promise<SetupGlobeSceneResult> {
  const [{ default: Globe }] = await Promise.all([import("globe.gl")]);

  mountNode.replaceChildren();

  const globe = new Globe(mountNode, {
    animateIn: false,
    waitForGlobeReady: true,
  }) as GlobeInstance;

  globe
    .backgroundColor("rgba(0,0,0,0)")
    .globeImageUrl(EARTH_BLUE_MARBLE_URL)
    .bumpImageUrl(EARTH_TOPOLOGY_URL)
    .showAtmosphere(true)
    .atmosphereColor("#86efac")
    .atmosphereAltitude(0.18)
    .objectsData(points)
    .objectLabel(() => "")
    .objectLat((point) => point.lat)
    .objectLng((point) => point.lng)
    .objectAltitude((point) => Math.max(0.024, point.size * 0.11))
    .objectFacesSurface(true)
    .objectThreeObject(createValidatorObject)
    .onObjectHover(onObjectHover);

  const material = globe.globeMaterial() as THREE.MeshPhongMaterial;
  material.specularMap = new THREE.TextureLoader().load(EARTH_WATER_URL);
  material.specular = new THREE.Color("#bbf7d0");
  material.shininess = 22;
  material.emissive = new THREE.Color("#06130f");
  material.emissiveIntensity = 0.08;
  material.bumpScale = 0.09;
  material.needsUpdate = true;

  const globeRadius = globe.getGlobeRadius();
  const cloudsTexture = new THREE.TextureLoader().load(CLOUDS_TEXTURE_URL);
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius * 1.007, 72, 72),
    new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.3,
    }),
  );
  clouds.raycast = () => null;
  globe.scene().add(clouds);

  const controls = globe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;
  controls.enablePan = false;
  controls.minDistance = 235;
  controls.maxDistance = 500;
  globe.pointOfView({ lat: 18, lng: 14, altitude: 1.96 }, 0);

  return { globe, clouds };
}
