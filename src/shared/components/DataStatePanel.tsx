type Props = {
  message: string;
  tone?: "neutral" | "error";
};

const toneClassNames: Record<NonNullable<Props["tone"]>, string> = {
  neutral:
    "border border-slate-500/70 bg-[linear-gradient(160deg,#d2dbe4,#c7d1ca_48%,#bcc7c0)] shadow-[0_20px_70px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_12%,rgba(134,239,172,0.08),transparent_30%),linear-gradient(160deg,#020617,#0c1f18_52%,#0f172a)] dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)] rounded-[1.2rem] px-4 py-12 text-center text-sm text-slate-600 dark:text-slate-300",
  error:
    "rounded-[2rem] border border-rose-300 bg-rose-50 px-4 py-5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200",
};

export function DataStatePanel({ message, tone = "neutral" }: Props) {
  return <div className={toneClassNames[tone]}>{message}</div>;
}
