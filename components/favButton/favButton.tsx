"use client";
import { useState } from "react";
import css from "./favButton.module.css";

interface FavButtonProps {
  size: "big" | "small";
}

export default function FavButton({ size }: FavButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <button
      className={`${size === "big" ? css.bigFavButton : css.favButton}`}
      type="button"
      data-favorite={isFavorite}
      aria-pressed={isFavorite}
      onClick={() => setIsFavorite((prev) => !prev)}
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
