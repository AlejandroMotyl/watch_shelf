import {
  ApiResponse,
  MediaStaff,
  TVId,
  MovieId,
  Favorite,
} from "@/types/media";
import { api } from "./api";
import { filterParams } from "@/types/filter";
import { MediaReviewsResponse } from "@/types/reviews";
import { LoginData, RegisterData, User } from "@/types/user";

interface CheckSessionRequest {
  success: boolean;
}

export type GetMediaByIdResponse = {
  media: TVId | MovieId;
  staff: MediaStaff;
};
type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

// !!!!!!!!! MEDIA
export const getTrending = async (
  filter: filterParams,
): Promise<ApiResponse> => {
  const { data } = await api.get<ApiResponse>(`/trending/${filter}`);
  return data;
};

export const getMediaById = async (
  type: "movie" | "tv",
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

// !!!!!!!!! PROFILE

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>("/profile");

  return data;
};

export const updateAvatar = async (file: File): Promise<{ user: User }> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch<{ user: User }>("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateUsername = async (
  username: string,
): Promise<{ user: User }> => {
  const { data } = await api.patch<{ user: User }>("/profile/username", {
    username,
  });

  return data;
};

export const updatePassword = async (
  data: ChangePasswordData,
): Promise<void> => {
  await api.patch("/profile/password", data);
};

// !!!!!!!!! FAVORITES
type FavoritesResponse = {
  favorites: Favorite[];
};

export const getFavorites = async (): Promise<Favorite[]> => {
  const { data } = await api.get<FavoritesResponse>("/profile/favorites");

  return data.favorites;
};
export const addFavorite = async ({
  type,
  id,
}: {
  type: "movie" | "tv";
  id: number;
}): Promise<Favorite> => {
  const { data } = await api.post<Favorite>("/profile/favorites", {
    type,
    id,
  });

  return data;
};

export const removeFavorite = async (
  type: "movie" | "tv",
  id: string,
): Promise<void> => {
  await api.delete(`/profile/favorites/${type}/${id}`);
};
// !!!!!!!!! AUTH

export const checkSession = async () => {
  const { data } = await api.post<CheckSessionRequest>("/auth/refresh", {});
  return data.success;
};

export const logout = async (): Promise<void> => {
  const { data } = await api.post<void>("/auth/logout");
  return data;
};

export const register = async (credentials: RegisterData) => {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
};

export const login = async (credentials: LoginData) => {
  const { data } = await api.post<User>("/auth/login", credentials);

  return data;
};
