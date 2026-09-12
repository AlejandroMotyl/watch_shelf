"use client";

import css from "./favButton.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorites, removeFavorite } from "@/lib/api/clientApi";
import { showError } from "@/utils/iziToast";

interface FavButtonProps {
  size: "big" | "small";
  type: "movie" | "tv";
  id: string;
}

export default function FavButton({ size, type, id }: FavButtonProps) {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const isFavorite = favorites.some(
    (favorite) =>
      favorite.tmdb_id === String(id) && favorite.media_type === type,
  );

  const addMutation = useMutation({
    mutationFn: addFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
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
        queryKey: ["favorites"],
      });
    },

    onError: () => {
      showError("Failed to remove from favorites");
    },
  });

  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleFavorite = () => {
    if (isPending) return;

    if (isFavorite) {
      removeMutation.mutate({ type, id });
    } else {
      addMutation.mutate({ type, id });
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
