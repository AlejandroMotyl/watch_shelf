"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./page.module.css";
import { getMediaById, getRating, saveRating } from "@/lib/api/clientApi";
import Image from "next/image";
import FavButton from "@/components/favButton/favButton";
import { useState } from "react";
import { getPosterUrl } from "@/lib/services/mediaPosters";

interface CatalogueIdPageClientProps {
  type: "movie" | "tv";
  id: string;
}

export default function CatalogueIdPageClient({
  type,
  id,
}: CatalogueIdPageClientProps) {
  const queryClient = useQueryClient();

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // MEDIA
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["media", type, id],
    queryFn: () => getMediaById(type, id),
    enabled: !!type && !!id,
    refetchOnMount: false,
  });

  // USER'S RATING
  const { data: userRating, isLoading: isRatingLoading } = useQuery({
    queryKey: ["rating", type, id],
    queryFn: () => getRating(type, Number(id)),
    enabled: !!type && !!id,
  });

  // SAVE RATING
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

  const media = data?.media;
  const staff = data?.staff;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>
        Failed to load media:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!media) {
    return <p>Media not found.</p>;
  }

  let length = "";

  if (media.media_type === "movie") {
    const hours = Math.floor(media.runtime / 60);
    const minutes = media.runtime % 60;

    length = [hours > 0 && `${hours}h`, minutes > 0 && `${minutes}m`]
      .filter(Boolean)
      .join(" ");
  }

  const posterUrl = getPosterUrl(media.poster_path, "w500");

  const selectedRating = userRating?.rating ?? null;

  const displayedRating = hoverRating ?? selectedRating;

  const handleRatingClick = (rating: number) => {
    ratingMutation.mutate(rating);
  };

  return (
    <main className={css.mediaPage}>
      <section className={css.mediaCard}>
        <div className={css.mediaHero}>
          <div className={css.posterWrapper}>
            <Image
              className={css.poster}
              src={posterUrl ?? ""}
              alt={"title" in media ? media.title : media.name}
              width={500}
              height={750}
              loading="eager"
            />
          </div>

          <div className={css.mediaInfo}>
            <div className={css.mediaHeader}>
              <span className={css.mediaType}>{type}</span>

              <h1 className={css.mediaTitle}>
                {"title" in media ? media.title : media.name}
              </h1>

              <p className={css.mediaMeta}>
                {"release_date" in media
                  ? media.release_date.slice(0, 4)
                  : media.first_air_date.slice(0, 4)}

                <span className={css.metaSeparator}>•</span>

                {length}

                <span className={css.metaSeparator}>•</span>

                {media.genres?.map((genre) => genre.name).join(", ")}
              </p>
            </div>

            <div className={css.rating}>
              <div className={css.ratingScore}>
                <span className={css.ratingValue}>
                  {media.vote_average.toFixed(2)}
                </span>

                <span className={css.ratingMax}>/10</span>
              </div>

              <div className={css.ratingInfo}>
                <span className={css.ratingLabel}>TMDb Rating</span>

                <span className={css.ratingVotes}>
                  {media.vote_count} votes
                </span>
              </div>
            </div>

            <p className={css.mediaDescription}>{media.overview}</p>

            <div className={css.mediaActions}>
              <button className={css.primaryButton} type="button">
                Watch trailer
              </button>

              <FavButton
                size="big"
                id={String(media.id)}
                type={media.media_type}
              />

              <div className={css.userRating}>
                <span className={css.ratingLabel}>Your rating</span>

                <div
                  className={css.starRating}
                  onMouseLeave={() => setHoverRating(null)}
                >
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
                  <span className={css.ratingError}>
                    Failed to save rating.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MEDIA DETAILS */}

        <section className={css.detailsSection}>
          <h2 className={css.sectionTitle}>Details</h2>

          <div className={css.detailsGrid}>
            <div className={css.detailItem}>
              <span className={css.detailLabel}>Director</span>

              <span className={css.detailValue}>
                {staff?.directors.map((director) => director.name).join(", ")}
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Writers</span>

              <span className={css.detailValue}>
                {staff?.writers.map((writer) => writer.name).join(", ")}
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Stars</span>

              <span className={css.detailValue}>
                {staff?.stars.map((star) => star.name).join(", ")}
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Genres</span>

              <span className={css.detailValue}>
                {media.genres?.map((genre) => genre.name).join(", ")}
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Release date</span>

              <span className={css.detailValue}>
                {new Date(
                  "release_date" in media
                    ? media.release_date
                    : media.first_air_date,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Country</span>

              <span className={css.detailValue}>{media.origin_country}</span>
            </div>
          </div>
        </section>

        {/* TMDB RATING */}

        <section className={css.TMDbSection}>
          <div className={css.TMDbHeader}>
            <span className={css.TMDbBadge}>TMDb</span>

            <div className={css.TMDbInfo}>
              <span className={css.TMDbTitle}>TMDb rating</span>

              <span className={css.TMDbSubtitle}>
                Based on {media.vote_count} user ratings
              </span>
            </div>

            <div className={css.TMDbRating}>
              <span className={css.TMDbScore}>
                {media.vote_average.toFixed(1)}
              </span>

              <span className={css.TMDbMax}>/10</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
