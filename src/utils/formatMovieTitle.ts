// Appends the release year to a movie title, e.g. "Inception (2010)".
// Returns the bare title when the release date is missing or does not start with four digits.
export const formatMovieTitle = (
  title: string,
  releaseDate?: string | null,
): string => {
  const year = releaseDate?.match(/^\d{4}/)?.[0];
  return year ? `${title} (${year})` : title;
};

export default formatMovieTitle;
