import { useContext } from "react";
import { WatchlistContext } from "../context/WatchlistContextDef";
import type { WatchlistContextType } from "../types/watchlist";

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlist must be used inside WatchlistProvider");
  }

  return context;
};
