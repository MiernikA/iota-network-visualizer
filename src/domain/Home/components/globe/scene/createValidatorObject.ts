import * as THREE from "three";
import type { ValidatorGlobePoint } from "../data/useValidatorGlobePoints";
import { createBadgeSprite, createGlowSprite } from "../assets/sprites";

export function createValidatorObject(point: ValidatorGlobePoint) {
  const heightValue = Math.max(3.1, 2.1 + point.size * 3.5);
  const group = new THREE.Group();

  const glow = createGlowSprite();
  glow.scale.setScalar(10.8 + point.size * 4.8);
  glow.position.y = 0.18;
  group.add(glow);

  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(1.02 + point.size * 0.34, 24, 24),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ecfeff"),
      emissive: new THREE.Color("#22d3ee"),
      emissiveIntensity: 0.7,
      roughness: 0.28,
      metalness: 0.1,
    }),
  );
  orb.position.y = 0.14;
  group.add(orb);

  const badge = createBadgeSprite(point.markerLabel);
  badge.scale.set(7.4, 5.7, 1);
  badge.position.set(0, heightValue + 1.6, 0);
  group.add(badge);

  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(10.5 + point.size * 4.2, 32, 32),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  hitArea.position.y = heightValue * 0.72;
  group.add(hitArea);

  group.renderOrder = 10;
  return group;
}
