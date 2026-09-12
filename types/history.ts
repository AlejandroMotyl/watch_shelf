export type WatchHistory = {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  release_date: string | null;
  genres: number[];
  progress_seconds: number;
  duration_seconds: number | null;
  watched_at: string;
};
export type WatchHistoryResponse = {
  history: WatchHistory[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};
