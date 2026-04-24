import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useValidatorGlobePoints } from "./data/useValidatorGlobePoints";
import type { ValidatorGlobePoint } from "./data/useValidatorGlobePoints";
import type { ValidatorSnapshot } from "../../../../types/validators/ValidatorSnapshot";
import type { GlobeInstance } from "../../../../types/globe/scene";
import { GlobeHoverCard } from "./components/GlobeHoverCard";
import { GlobeRotationToggle } from "./components/GlobeRotationToggle";
import { GlobeStatusOverlay } from "./components/GlobeStatusOverlay";
import { useElementSize } from "./hooks/useElementSize";
import { setupGlobeScene } from "./scene/setupGlobeScene";

type Props = {
  validators: ValidatorSnapshot[];
  height: number;
};

function waitForIdle(timeoutMs = 1200): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const requestIdle = (window as unknown as {
    requestIdleCallback?: (_cb: () => void, _options?: { timeout: number }) => number
  }).requestIdleCallback;

  if (requestIdle) {
    return new Promise((resolve) => {
      requestIdle(resolve, { timeout: timeoutMs });
    });
  }

  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose());
    return;
  }

  material.dispose();
}

export function GlobeScene({ validators, height }: Props) {
  const globeFrameRef = useRef<HTMLDivElement | null>(null);
  const globeMountRef = useRef<HTMLDivElement | null>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointsRef = useRef<ValidatorGlobePoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<ValidatorGlobePoint | null>(
    null,
  );
  const [cursorPosition, setCursorPosition] = useState({ x: 24, y: 24 });
  const [isAutoRotateEnabled, setIsAutoRotateEnabled] = useState(true);
  const geoState = useValidatorGlobePoints(validators);
  const frameSize = useElementSize(globeFrameRef);

  useEffect(() => {
    pointsRef.current = geoState.points;
  }, [geoState.points]);

  useEffect(() => {
    let isDisposed = false;
    let cleanupResize: (() => void) | undefined;
    const mountNode = globeMountRef.current;

    async function mountGlobe() {
      if (isDisposed || !mountNode) {
        return;
      }

      await waitForIdle();
      if (isDisposed || !mountNode) {
        return;
      }

      const { globe, clouds } = await setupGlobeScene({
        mountNode,
        points: pointsRef.current,
        onObjectHover: (point) => {
          setHoveredPoint(point);
        },
      });
      if (isDisposed) {
        clouds.geometry.dispose();
        disposeMaterial(clouds.material);
        globe.pauseAnimation();
        return;
      }

      globeInstanceRef.current = globe;
      cloudsRef.current = clouds;

      const rotateClouds = () => {
        if (cloudsRef.current) {
          cloudsRef.current.rotation.y -= 0.00012;
        }
        animationFrameRef.current = window.requestAnimationFrame(rotateClouds);
      };
      rotateClouds();

      const resize = () => {
        globe.width(mountNode.clientWidth);
        globe.height(mountNode.clientHeight);
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mountNode);
      cleanupResize = () => observer.disconnect();
    }

    void mountGlobe();

    return () => {
      isDisposed = true;
      cleanupResize?.();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (cloudsRef.current && globeInstanceRef.current) {
        globeInstanceRef.current.scene().remove(cloudsRef.current);
        cloudsRef.current.geometry.dispose();
        disposeMaterial(cloudsRef.current.material);
        cloudsRef.current = null;
      }

      globeInstanceRef.current?.pauseAnimation();
      mountNode?.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe) {
      return;
    }

    globe.controls().autoRotate = isAutoRotateEnabled;
  }, [isAutoRotateEnabled]);

  useEffect(() => {
    globeInstanceRef.current?.objectsData(geoState.points);
  }, [geoState.points]);

  return (
    <div
      ref={globeFrameRef}
      className="relative overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        ref={globeMountRef}
        className="h-full w-full scale-[0.94] [&_canvas]:cursor-grab active:[&_canvas]:cursor-grabbing"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          setCursorPosition({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          });
        }}
        onPointerLeave={() => setHoveredPoint(null)}
      />

      <GlobeRotationToggle
        isAutoRotateEnabled={isAutoRotateEnabled}
        onToggle={() => setIsAutoRotateEnabled((value) => !value)}
      />

      {hoveredPoint ? (
        <GlobeHoverCard
          point={hoveredPoint}
          cursorPosition={cursorPosition}
          frameSize={frameSize}
        />
      ) : null}

      <GlobeStatusOverlay
        isLoading={geoState.isLoading}
        hasPoints={geoState.points.length > 0}
        error={geoState.error}
      />
    </div>
  );
}
