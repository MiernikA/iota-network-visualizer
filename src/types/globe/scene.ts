import type * as THREE from "three";
import type { ValidatorGlobePoint } from "./ValidatorGlobePoint";

export type GlobeControls = {
  autoRotate: boolean;
  autoRotateSpeed: number;
  enablePan: boolean;
  minDistance: number;
  maxDistance: number;
};

type PointLabelAccessor = (..._args: [ValidatorGlobePoint | null]) => string;
type PointNumberAccessor = (..._args: [ValidatorGlobePoint]) => number;
type PointObjectAccessor = (..._args: [ValidatorGlobePoint]) => THREE.Object3D;
type PointHoverHandler = (..._args: [ValidatorGlobePoint | null]) => void;

export type GlobeInstance = {
  backgroundColor(..._args: [string]): GlobeInstance;
  globeImageUrl(..._args: [string]): GlobeInstance;
  bumpImageUrl(..._args: [string]): GlobeInstance;
  showAtmosphere(..._args: [boolean]): GlobeInstance;
  atmosphereColor(..._args: [string]): GlobeInstance;
  atmosphereAltitude(..._args: [number]): GlobeInstance;
  objectsData(..._args: [ValidatorGlobePoint[]]): GlobeInstance;
  objectLabel(..._args: [PointLabelAccessor]): GlobeInstance;
  objectLat(..._args: [PointNumberAccessor]): GlobeInstance;
  objectLng(..._args: [PointNumberAccessor]): GlobeInstance;
  objectAltitude(..._args: [PointNumberAccessor]): GlobeInstance;
  objectFacesSurface(..._args: [boolean]): GlobeInstance;
  objectThreeObject(..._args: [PointObjectAccessor]): GlobeInstance;
  onObjectHover(..._args: [PointHoverHandler]): GlobeInstance;
  globeMaterial(): THREE.Material;
  getGlobeRadius(): number;
  scene(): THREE.Scene;
  controls(): GlobeControls;
  pointOfView(
    ..._args: [{ lat: number; lng: number; altitude: number }, number]
  ): void;
  width(..._args: [number]): GlobeInstance;
  height(..._args: [number]): GlobeInstance;
  pauseAnimation(): void;
};
