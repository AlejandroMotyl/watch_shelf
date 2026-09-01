const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

export function getPosterUrl(path: string | null, size = "w500") {
  if (!path) return null;

  return `${TMDB_IMAGE_URL}/${size}${path}`;
}
