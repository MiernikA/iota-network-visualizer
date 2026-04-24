import type { RefObject } from "react";
import { useEffect, useState } from "react";

type ElementSize = {
  width: number;
  height: number;
};

const DEFAULT_SIZE: ElementSize = {
  width: 480,
  height: 420,
};

export function useElementSize(
  elementRef: RefObject<HTMLElement | null>,
  fallback: ElementSize = DEFAULT_SIZE,
) {
  const [size, setSize] = useState<ElementSize>(fallback);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    const updateSize = () => {
      setSize({
        width: element.clientWidth || fallback.width,
        height: element.clientHeight || fallback.height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, fallback.height, fallback.width]);

  return size;
}
