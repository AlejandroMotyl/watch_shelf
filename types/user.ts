export type User = {
  avatar_url: string;
  id: number;
  username: string;
  email: string;
  created_at: Date;
};

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export type UserReview = {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";

  title: string;
  poster_path: string | null;
  release_date: string | null;
  genres: number[];

  review_content: string;

  created_at: string;
  updated_at: string;
};
export type UserReviewDetail = {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";
  review_content: string;
  created_at: string;
  updated_at: string;
};
export type SaveReviewVariables = {
  tmdbId: number;
  type: "movie" | "tv";
  reviewContent: string;
};

export type SaveReviewResponse = {
  review: UserReview;
};
export type ReviewsResponse = {
  reviews: UserReview[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};
