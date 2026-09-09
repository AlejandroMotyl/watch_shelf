"use client";
import { useState } from "react";
import css from "./favButton.module.css";
import { useMutation } from "@tanstack/react-query";
import { addFavorite } from "@/lib/api/clientApi";
import { showError } from "@/utils/iziToast";

interface FavButtonProps {
  size: "big" | "small";
  type: "movie" | "tv";
  id: number;
}

export default function FavButton({ size, type, id }: FavButtonProps) {
  const { mutate: AddingFavoritesMutation, isPending } = useMutation({
    onSuccess: () => setIsFavorite(true),
    mutationFn: addFavorite,
    onError: () => showError("Failed to add to favorites"),
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const addFavoriteHandler = () => {
    AddingFavoritesMutation({ type, id });
  };
  return (
    <button
      className={`${size === "big" ? css.bigFavButton : css.favButton}`}
      type="button"
      data-favorite={isFavorite}
      aria-pressed={isFavorite}
      onClick={addFavoriteHandler}
    >
      <svg
        className={`${size === "big" ? css.bigIcon : css.icon}`}
        aria-hidden="true"
      >
        <use className={css.heartFill} href="/sprite.svg#heart-filled" />
        <use className={css.heartOutline} href="/sprite.svg#heart" />
      </svg>
    </button>
  );
}
