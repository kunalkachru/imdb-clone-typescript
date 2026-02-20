import { createContext } from "react";
import type { WatchlistContextType } from "../types/watchlist";

export const WatchlistContext = createContext<WatchlistContextType | null>(
  null,
);
