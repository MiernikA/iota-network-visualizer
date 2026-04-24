type Props = {
  isLoading: boolean;
  hasPoints: boolean;
  error: string;
};

export function GlobeStatusOverlay({
  isLoading,
  hasPoints,
  error,
}: Props) {
  if (isLoading) {
    return (
      <div className="absolute inset-0 grid place-items-center text-sm text-slate-700 dark:text-slate-200">
        Preparing validator positions...
      </div>
    );
  }

  if (!hasPoints) {
    return (
      <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-slate-700 dark:text-slate-200">
        {error
          ? `Unable to prepare validator positions: ${error}`
          : "No validator positions are available."}
      </div>
    );
  }

  return null;
}
