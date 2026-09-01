export interface ReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface Review {
  author: string;
  author_details: ReviewAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface ReviewsResponse {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}
export interface MediaReview {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  review: {
    rating: number | null;
    text: string;
    author: string;
  } | null;
}

export interface MediaReviewsResponse {
  page: number;
  total_pages: number;
  results: MediaReview[];
}
