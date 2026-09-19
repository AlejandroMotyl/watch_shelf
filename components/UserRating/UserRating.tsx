"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./UserRating.module.css";
import { getRating, saveRating } from "@/lib/api/clientApi";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { filterParams } from "@/types/filter";
interface UserRatingProps {
  type: filterParams;
  id: string;
}

export default function UserRating({ type, id }: UserRatingProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const { data: userRating, isLoading: isRatingLoading } = useQuery({
    queryKey: ["rating", type, id],
    queryFn: () => getRating(type, Number(id)),
    enabled: !!type && !!id && !!isAuthenticated,
  });

  const ratingMutation = useMutation({
    mutationFn: (rating: number) =>
      saveRating({
        tmdbId: Number(id),
        type,
        rating,
      }),

    onSuccess: (rating) => {
      queryClient.setQueryData(["rating", type, id], rating);
    },
  });

  const selectedRating = userRating?.rating ?? null;
  const displayedRating = hoverRating ?? selectedRating;

  const handleRatingClick = (rating: number) => {
    ratingMutation.mutate(rating);
  };

  return (
    <div className={css.userRating}>
      <span className={css.ratingLabel}>Your rating</span>

      <div className={css.starRating} onMouseLeave={() => setHoverRating(null)}>
        {isRatingLoading ? (
          <span>Loading...</span>
        ) : (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`${css.starButton} ${
                displayedRating !== null && rating <= displayedRating
                  ? css.starActive
                  : ""
              }`}
              onMouseEnter={() => setHoverRating(rating)}
              onClick={() => handleRatingClick(rating)}
              disabled={ratingMutation.isPending}
              aria-label={`Rate ${rating} out of 10`}
            >
              ★
            </button>
          ))
        )}
      </div>

      {ratingMutation.isError && (
        <span className={css.ratingError}>Failed to save rating.</span>
      )}
    </div>
  );
}
