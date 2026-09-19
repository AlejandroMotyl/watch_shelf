"use client";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import css from "./UserReviewSection.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/utils/iziToast";
import { useState } from "react";
import { getReview, saveReview } from "@/lib/api/clientApi";
import { filterParams } from "@/types/filter";
interface UserReviewSectionProps {
  type: filterParams;
  id: string;
}

export default function UserReviewSection({
  type,
  id,
}: UserReviewSectionProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const [reviewContent, setReviewContent] = useState("");

  const { data: userReview, isLoading: isReviewLoading } = useQuery({
    queryKey: ["review", type, id],
    queryFn: () => getReview(type, Number(id)),
    enabled: !!type && !!id && !!isAuthenticated,
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      saveReview({
        tmdbId: Number(id),
        type,
        reviewContent: reviewContent.trim(),
      }),

    onSuccess: (review) => {
      queryClient.setQueryData(["review", type, id], review);

      setReviewContent(review.review_content);
    },

    onError: () => {
      showError("Failed to save review");
    },
  });

  const handleReviewSubmit = () => {
    const content = reviewContent.trim();

    if (!content || reviewMutation.isPending) {
      return;
    }

    reviewMutation.mutate();
  };

  return (
    <section className={css.reviewSection}>
      <div className={css.reviewHeader}>
        <h2 className={css.sectionTitle}>Your review</h2>

        <p className={css.sectionDescription}>
          Share your thoughts about this title.
        </p>
      </div>

      {!isAuthenticated ? (
        <p className={css.sectionDescription}>Sign in to write a review.</p>
      ) : isReviewLoading ? (
        <p className={css.sectionDescription}>Loading your review...</p>
      ) : (
        <>
          {isReviewLoading ? (
            <p>Loading your review...</p>
          ) : (
            <textarea
              className={css.reviewTextarea}
              defaultValue={userReview?.review_content ?? ""}
              onChange={(event) => setReviewContent(event.target.value)}
              placeholder="What did you think about this movie or show?"
              maxLength={2000}
              rows={6}
              disabled={reviewMutation.isPending}
            />
          )}

          <div className={css.reviewFooter}>
            <span className={css.reviewCounter}>
              {reviewContent.length}/2000
            </span>

            <button
              type="button"
              className={css.primaryButton}
              onClick={handleReviewSubmit}
              disabled={reviewMutation.isPending || !reviewContent.trim()}
            >
              {reviewMutation.isPending
                ? "Saving..."
                : userReview
                  ? "Update review"
                  : "Post review"}
            </button>
          </div>

          {reviewMutation.isError && (
            <p className={css.reviewError} role="alert">
              Failed to save your review. Please try again.
            </p>
          )}
        </>
      )}
    </section>
  );
}
