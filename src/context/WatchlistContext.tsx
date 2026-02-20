import { useReducer, useEffect } from "react";
import type { Movie } from "../types/movie";
import type { WatchlistAction } from "../types/watchlist";
import { WatchlistContext } from "./WatchlistContextDef";

function watchlistReducer(state: Movie[], action: WatchlistAction): Movie[] {
  switch (action.type) {
    case "ADD_MOVIE":
      return [...state, action.payload];
    case "REMOVE_MOVIE":
      return state.filter((movie) => movie.id !== action.payload);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

interface WatchlistProviderProps {
  children: React.ReactNode;
}

export const WatchlistProvider = ({ children }: WatchlistProviderProps) => {
  // restore from localStorage on mount
  const getInitialWatchlist = (): Movie[] => {
    const stored = localStorage.getItem("watchlist");
    return stored ? (JSON.parse(stored) as Movie[]) : [];
  };

  const [watchlist, dispatch] = useReducer(
    watchlistReducer,
    [],
    getInitialWatchlist,
  );

  // save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const isInWatchlist = (id: number): boolean => {
    return watchlist.some((movie) => movie.id === id);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, dispatch, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
