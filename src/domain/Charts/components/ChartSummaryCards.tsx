type SummaryCard = {
  label: string;
  value: string;
};

type Props = {
  cards: SummaryCard[];
};

export function ChartSummaryCards({ cards }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => (
        <div
          key={item.label}
          className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-[1.15rem] px-4 py-3"
        >
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-600 dark:text-white">
            {item.label}
          </p>
          <p className="mt-2 font-['Space_Grotesk'] text-[0.92rem] font-semibold text-slate-900 dark:text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
