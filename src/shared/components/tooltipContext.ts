import { createContext } from "react";

export type TooltipController = {
  show: (_ownerId: string, _content: string, _className?: string) => void;
  hide: (_ownerId: string) => void;
};

export const TooltipContext = createContext<TooltipController | null>(null);
