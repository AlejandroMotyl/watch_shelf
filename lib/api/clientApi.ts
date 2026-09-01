import { ApiResponse, MediaStaff, TVId, MovieId } from "@/types/media";
import { api } from "./api";
import { filterParams } from "@/types/filter";
import { MediaReviewsResponse, ReviewsResponse } from "@/types/reviews";

interface CheckSessionRequest {
  success: boolean;
}

export type GetMediaByIdResponse = {
  media: TVId | MovieId;
  staff: MediaStaff;
};

export const getTrending = async (
  filter: filterParams,
): Promise<ApiResponse> => {
  const { data } = await api.get<ApiResponse>(`/trending/${filter}`);
  return data;
};

export const getMediaById = async (
  type: string,
  id: string,
): Promise<GetMediaByIdResponse> => {
  const { data } = await api.get<GetMediaByIdResponse>(
    `/catalogue/${type}/${id}`,
  );

  return data;
};
export const getReviews = async (
  filter: filterParams,
): Promise<MediaReviewsResponse> => {
  const { data } = await api.get<MediaReviewsResponse>(`/reviews/${filter}`);

  return data;
};
