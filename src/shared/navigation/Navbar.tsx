import { Link, NavLink } from "react-router-dom";
import { PAGE_PATHS, PAGES } from "./routes";

export function Navbar() {
  return (
    <div
      className="border border-slate-500/70 bg-[linear-gradient(160deg,#d2dbe4,#c7d1ca_48%,#bcc7c0)] shadow-[0_20px_70px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_12%,rgba(134,239,172,0.08),transparent_30%),linear-gradient(160deg,#020617,#0c1f18_52%,#0f172a)] dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)] mb-6 rounded-[1.2rem] px-4 py-3 sm:mb-8 sm:px-5"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-center justify-center lg:justify-start">
          <Link
            to={PAGE_PATHS.home}
            aria-label="Go to dashboard home"
            className="group inline-flex cursor-pointer items-center gap-3 text-left transition-[transform,color] duration-150 hover:-translate-y-px active:translate-y-0"
          >
            <span
              className="bg-[radial-gradient(circle_at_30%_30%,#dcfce7_0%,#86efac_44%,#4ade80_100%)] shadow-[0_0_24px_rgba(134,239,172,0.16)] flex h-9 w-9 items-center justify-center rounded-xl p-1"
            >
              <img
                src={`${import.meta.env.BASE_URL}favicon.svg`}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="font-['Space_Grotesk'] text-[1.65rem] font-semibold tracking-tight text-slate-900 transition group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-200">
              iota
              <span className="text-emerald-600 dark:text-emerald-200">
                .dashboard
              </span>
            </span>
          </Link>
        </div>

        <div className="flex justify-center">
          <nav
            className="border border-slate-500/75 bg-[linear-gradient(135deg,#ccd5df,#c1ccc5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)] dark:border-white/12 dark:bg-[linear-gradient(135deg,#112019,#172033)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex w-full flex-wrap justify-center gap-1 rounded-[1.2rem] p-1.5 sm:w-auto"
          >
            {PAGES.map((entry) => {
              return (
                <NavLink
                  key={entry}
                  to={PAGE_PATHS[entry]}
                  aria-label={`Open ${entry} view`}
                  className={({ isActive }) =>
                    `rounded-[1.25rem] px-5 py-2.5 text-sm font-semibold capitalize transition ${
                      isActive
                        ? "bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-slate-900 shadow-[0_8px_22px_rgba(134,239,172,0.16)] dark:bg-[linear-gradient(135deg,#a7f3d0_0%,#86efac_100%)] dark:text-slate-950"
                        : "cursor-pointer text-slate-800 hover:-translate-y-px hover:bg-[linear-gradient(135deg,rgba(244,253,246,0.96),rgba(235,248,239,0.9))] hover:text-slate-950 active:translate-y-0 dark:text-slate-100 dark:hover:bg-[linear-gradient(135deg,rgba(134,239,172,0.06),rgba(255,255,255,0.02))] dark:hover:text-white"
                    }`
                  }
                >
                  {entry}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
