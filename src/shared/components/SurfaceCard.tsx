import type { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}>;

export function SurfaceCard({
  title,
  subtitle,
  action,
  className = "",
  children,
}: Props) {
  return (
    <section
      className={`border border-slate-500/70 bg-[linear-gradient(160deg,#d2dbe4,#c7d1ca_48%,#bcc7c0)] shadow-[0_20px_70px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_12%,rgba(134,239,172,0.08),transparent_30%),linear-gradient(160deg,#020617,#0c1f18_52%,#0f172a)] dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)] rounded-[1.2rem] p-5 ${className}`}
    >
      {title || subtitle || action ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <p className="font-['Space_Grotesk'] text-[1.08rem] font-semibold text-slate-900 dark:text-white">
                {title}
              </p>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-[0.82rem] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
