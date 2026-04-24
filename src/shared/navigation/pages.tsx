import { lazy } from "react";
import { DataStatePanel } from "../components/DataStatePanel";
import type { useDashboardData } from "../../api/hooks/useDashboardData";
import { DataBoundary } from "../components/DataBoundary";

const HomeDashboardLazy = lazy(() =>
  import("../../domain/Home/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);
const ValidatorsPageLazy = lazy(() =>
  import("../../domain/Validators/ValidatorsPage").then((module) => ({
    default: module.ValidatorsPage,
  })),
);
const ChartsPageLazy = lazy(() =>
  import("../../domain/Charts/ChartsPage").then((module) => ({
    default: module.ChartsPage,
  })),
);

export type PageComponentProps = ReturnType<typeof useDashboardData>;

export function HomeRoute({ data, isLoading, error, updatedAt }: PageComponentProps) {
  return (
    <DataBoundary
      data={data}
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading dashboard..."
    >
      {(snapshot) => (
        <HomeDashboardLazy snapshot={snapshot} updatedAt={updatedAt} />
      )}
    </DataBoundary>
  );
}

export function ValidatorsRoute({ data, isLoading, error }: PageComponentProps) {
  return (
    <DataBoundary
      data={data}
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading validators set..."
    >
      {(snapshot) => <ValidatorsPageLazy snapshot={snapshot} />}
    </DataBoundary>
  );
}

export function ChartsRoute({ data, isLoading, error }: PageComponentProps) {
  return (
    <DataBoundary
      data={data}
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading charts..."
    >
      {(snapshot) => <ChartsPageLazy snapshot={snapshot} />}
    </DataBoundary>
  );
}

export function PageFallback() {
  return <DataStatePanel message="Loading view..." />;
}
