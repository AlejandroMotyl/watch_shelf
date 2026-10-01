import { cookies } from "next/headers";
import { api } from "./api";
import { ReviewsResponse } from "@/types/user";
import { ApiResponse, FavoritesResponse } from "@/types/media";
import { WatchHistoryResponse } from "@/types/history";
import { GetMediaByIdResponse } from "./clientApi";
import { MediaReviewsResponse } from "@/types/reviews";
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  return await api.post(
    `/auth/refresh`,
    {},
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
};

export const getFavoritesServer = async (
  page = 1,
  limit = 12,
): Promise<FavoritesResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get<FavoritesResponse>("/profile/favorites", {
    params: {
      page,
      limit,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const getUserReviewsServer = async (
  page = 1,
  limit = 12,
): Promise<ReviewsResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get<ReviewsResponse>("/profile/reviews", {
    params: {
      page,
      limit,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const getWatchHistoryServer = async (
  page = 1,
  limit = 12,
): Promise<WatchHistoryResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get<WatchHistoryResponse>("/profile/history", {
    params: {
      page,
      limit,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};
export const getMediaByIdServer = async (
  media_type: "movie" | "tv",
  tmdbId: number,
): Promise<GetMediaByIdResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get<GetMediaByIdResponse>(
    `/catalogue/${media_type}/${tmdbId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return data;
};
export const getTrendingServer = async (
  filter: string,
): Promise<ApiResponse> => {
  const { data } = await api.get<ApiResponse>(`/trending/${filter}`);

  return data;
};

export const getReviewsServer = async (
  media_type: "movie" | "tv",
  page: number = 1,
): Promise<MediaReviewsResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get<MediaReviewsResponse>(
    `/reviews/${media_type}/`,
    {
      params: {
        page,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return data;
};
