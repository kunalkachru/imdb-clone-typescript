import { useReducer, useEffect, useContext, useMemo, useRef } from "react";
import type { Movie } from "../types/movie";
import type { WatchlistAction } from "../types/watchlist";
import { WatchlistContext } from "./WatchlistContextDef";
import { AuthContext } from "./AuthContextDef";

function watchlistReducer(state: Movie[], action: WatchlistAction): Movie[] {
  switch (action.type) {
    case "ADD_MOVIE":
      if (state.some((movie) => movie.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];
    case "REMOVE_MOVIE":
      return state.filter((movie) => movie.id !== action.payload);
    case "SET_MOVIES":
      return action.payload;
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
  const authContext = useContext(AuthContext);
  const storageKey = useMemo(
    () => `watchlist:${authContext?.user?.id ?? "guest"}`,
    [authContext?.user?.id],
  );

  const loadWatchlist = (key: string): Movie[] => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as Movie[]) : [];
  };

  const [watchlist, dispatch] = useReducer(
    watchlistReducer,
    [],
    () => loadWatchlist(storageKey),
  );
  const canPersistRef = useRef(false);

  // re-hydrate when active user changes
  useEffect(() => {
    // Prevent stale state from previous user being persisted under a new key.
    canPersistRef.current = false;
    dispatch({ type: "SET_MOVIES", payload: loadWatchlist(storageKey) });
  }, [storageKey]);

  // save to localStorage whenever watchlist changes for active user key
  useEffect(() => {
    if (!canPersistRef.current) {
      canPersistRef.current = true;
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(watchlist));
  }, [storageKey, watchlist]);

  const isInWatchlist = (id: number): boolean => {
    return watchlist.some((movie) => movie.id === id);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, dispatch, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
