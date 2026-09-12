export type Rating = {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";
  rating: number;
  created_at: string;
  updated_at: string;
};
export type SaveRatingVariables = {
  tmdbId: number;
  type: "movie" | "tv";
  rating: number;
};
export type SaveRatingResponse = { rating: Rating };
export type GetRatingResponse = { rating: Rating | null };
