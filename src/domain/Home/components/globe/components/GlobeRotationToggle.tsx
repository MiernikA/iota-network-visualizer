type Props = {
  isAutoRotateEnabled: boolean;
  onToggle: () => void;
};

function GlobeRotationIcon({ isAutoRotateEnabled }: { isAutoRotateEnabled: boolean }) {
  if (isAutoRotateEnabled) {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
        <rect x="5" y="4.5" width="3" height="11" rx="1" fill="currentColor" />
        <rect x="12" y="4.5" width="3" height="11" rx="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="M6 4.75 14.5 10 6 15.25Z" fill="currentColor" />
    </svg>
  );
}

export function GlobeRotationToggle({
  isAutoRotateEnabled,
  onToggle,
}: Props) {
  return (
    <div className="group absolute right-4 top-4 z-20">
      <button
        type="button"
        aria-label={isAutoRotateEnabled ? "Pause globe rotation" : "Resume globe rotation"}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/72 text-cyan-100 backdrop-blur-md transition-[transform,border-color,color] duration-150 hover:-translate-y-px hover:border-cyan-200/50 hover:text-white active:translate-y-0"
        onClick={onToggle}
      >
        <GlobeRotationIcon isAutoRotateEnabled={isAutoRotateEnabled} />
      </button>
      <div className="pointer-events-none absolute right-0 top-11 whitespace-nowrap rounded-md border border-cyan-300/25 bg-slate-950/88 px-2.5 py-1.5 text-[0.72rem] text-cyan-50 opacity-0 shadow-[0_12px_30px_rgba(2,6,23,0.35)] transition group-hover:opacity-100">
        {isAutoRotateEnabled ? "Pause globe rotation" : "Resume globe rotation"}
      </div>
    </div>
  );
}
