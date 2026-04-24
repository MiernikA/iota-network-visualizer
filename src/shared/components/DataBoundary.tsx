import type { ReactNode } from "react";
import { DataStatePanel } from "./DataStatePanel";

type Props<T> = {
  data: T | null;
  isLoading: boolean;
  error: string;
  loadingMessage: string;
  children: (_data: T) => ReactNode;
};

export function DataBoundary<T>({
  data,
  isLoading,
  error,
  loadingMessage,
  children,
}: Props<T>) {
  if (error) {
    return (
      <DataStatePanel
        tone="error"
        message="Something went wrong while loading this view."
      />
    );
  }

  if (isLoading || !data) {
    return <DataStatePanel message={loadingMessage} />;
  }

  return children(data);
}
