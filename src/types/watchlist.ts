import type { Movie } from "./movie";

// TS LESSON: discriminated union — each action has a unique 'type' string
// TypeScript uses 'type' field to know which action it is
// and what payload shape to expect
type WatchlistAction =
  | { type: "ADD_MOVIE"; payload: Movie } // payload = full Movie object
  | { type: "REMOVE_MOVIE"; payload: number } // payload = just the id
  | { type: "CLEAR" }; // no payload needed

// TS LESSON: interface for context shape
// everything our context will expose to components
interface WatchlistContextType {
  watchlist: Movie[];
  dispatch: React.Dispatch<WatchlistAction>;
  isInWatchlist: (id: number) => boolean;
}

export type { WatchlistAction, WatchlistContextType };
