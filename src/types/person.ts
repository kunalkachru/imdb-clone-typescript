// TS: a TMDB person (actor) as returned by /person/popular
export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
}
