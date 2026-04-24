export type Page = "home" | "validators" | "charts";

export const PAGES: Page[] = ["home", "validators", "charts"];

export const PAGE_PATHS: Record<Page, string> = {
  home: "/home",
  validators: "/validators",
  charts: "/charts",
};

