import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDashboardData } from "./api/hooks/useDashboardData";
import { Navbar } from "./shared/navigation/Navbar";
import { PAGE_PATHS } from "./shared/navigation/routes";
import {
  ChartsRoute,
  HomeRoute,
  PageFallback,
  ValidatorsRoute,
} from "./shared/navigation/pages";

export default function App() {
  const dashboard = useDashboardData();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.12),transparent_24%),linear-gradient(180deg,#d4dbe4_0%,#c8d3cc_42%,#bcc8c0_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,rgba(134,239,172,0.1),transparent_24%),linear-gradient(180deg,#020617_0%,#0b1d16_52%,#0f172a_100%)] dark:text-slate-100 [&_.float-tooltip-kap]:hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Navbar />

        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="home" replace />} />
              <Route path={PAGE_PATHS.home} element={<HomeRoute {...dashboard} />} />
              <Route
                path={PAGE_PATHS.validators}
                element={<ValidatorsRoute {...dashboard} />}
              />
              <Route
                path={PAGE_PATHS.charts}
                element={<ChartsRoute {...dashboard} />}
              />
              <Route path="*" element={<Navigate to="home" replace />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="mt-8 pb-2 text-center text-xs text-slate-600 dark:text-slate-400">
          Data via IOTA JSON-RPC endpoints · by Miernik Adrian
        </footer>
      </div>
    </div>
  );
}