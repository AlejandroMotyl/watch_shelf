"use client";

import css from "./favButton.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getAllFavorites,
  removeFavorite,
} from "@/lib/api/clientApi";
import { showError } from "@/utils/iziToast";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { Favorite } from "@/types/media";

interface FavButtonProps {
  size: "big" | "small";
  type: "movie" | "tv";
  id: string | number;
}

export default function FavButton({ size, type, id }: FavButtonProps) {
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["favorites", "all"],
    queryFn: getAllFavorites,
    enabled: isAuthenticated,
  });

  const isFavorite = favorites.some(
    (favorite) =>
      String(favorite.tmdb_id) === String(id) && favorite.media_type === type,
  );

  const addMutation = useMutation({
    mutationFn: addFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", "all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["favorites", "collection"],
      });
    },

    onError: () => {
      showError("Failed to add to favorites");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", "all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["favorites", "collection"],
      });
    },

    onError: () => {
      showError("Failed to remove from favorites");
    },
  });

  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleFavorite = () => {
    if (!isAuthenticated || isPending) {
      return;
    }

    const favorite = {
      type,
      id: String(id),
    };

    if (isFavorite) {
      removeMutation.mutate(favorite);
    } else {
      addMutation.mutate(favorite);
    }
  };

  return (
    <button
      className={size === "big" ? css.bigFavButton : css.favButton}
      type="button"
      data-favorite={isFavorite}
      aria-pressed={isFavorite}
      onClick={handleFavorite}
      disabled={isPending}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={size === "big" ? css.bigIcon : css.icon}
        aria-hidden="true"
      >
        <use className={css.heartFill} href="/sprite.svg#heart-filled" />
        <use className={css.heartOutline} href="/sprite.svg#heart" />
      </svg>
    </button>
  );
}
