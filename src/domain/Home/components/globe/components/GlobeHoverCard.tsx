import type { ValidatorGlobePoint } from "../data/useValidatorGlobePoints";

type Props = {
  point: ValidatorGlobePoint;
  cursorPosition: { x: number; y: number };
  frameSize: { width: number; height: number };
};

export function GlobeHoverCard({
  point,
  cursorPosition,
  frameSize,
}: Props) {
  return (
    <div
      className="pointer-events-none absolute z-20 w-[min(20rem,calc(100%-2rem))] rounded-[1.2rem] border border-cyan-300/35 bg-slate-950/84 p-4 text-white shadow-[0_24px_70px_rgba(2,6,23,0.5)] backdrop-blur-xl"
      style={{
        left: Math.max(16, Math.min(cursorPosition.x + 18, frameSize.width - 392)),
        top: Math.max(16, Math.min(cursorPosition.y + 18, frameSize.height - 308)),
      }}
    >
      <p className="font-['Space_Grotesk'] text-[1.05rem] font-semibold text-white">
        {point.name}
      </p>
      <div className="mt-3 space-y-2 text-[0.8rem] text-cyan-100/85">
        <p>
          {point.lat.toFixed(3)}, {point.lng.toFixed(3)}
        </p>
        <p>{point.locationLabel}</p>
      </div>
    </div>
  );
}
