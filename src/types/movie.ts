// TS : interface defines the shape of an object
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}
// TS: you can make fields optional by adding a question mark after the field name.
export interface MovieDetail extends Movie {
  runtime?: number;
  tagline?: string;
  genres?: Genre[];
  homepage?: string;
}

export interface Genre {
  id: number;
  name: string;
}