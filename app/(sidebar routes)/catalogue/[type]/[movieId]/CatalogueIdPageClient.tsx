"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./page.module.css";
import {
  getMediaById,
  getMediaTrailerById,
  getWatchHistoryItem,
} from "@/lib/api/clientApi";
import Image from "next/image";
import FavButton from "@/components/favButton/favButton";
import { useState } from "react";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import TrailerPlayer from "@/components/TrailerPlayer.tsx/TrailerPlayer";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { showError } from "@/utils/iziToast";
import UserRating from "@/components/UserRating/UserRating";
import UserReviewSection from "@/components/UserReviewSection/UserReviewSection";

interface CatalogueIdPageClientProps {
  type: "movie" | "tv";
  id: string;
}

export default function CatalogueIdPageClient({
  type,
  id,
}: CatalogueIdPageClientProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // MEDIA
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["media", type, id],
    queryFn: () => getMediaById(type, id),
    enabled: !!type && !!id,
    refetchOnMount: false,
  });

  // USER'S WATCH HISTORY
  const { data: watchHistory } = useQuery({
    queryKey: ["history", type, id],
    queryFn: () => getWatchHistoryItem(type, Number(id)),
    enabled: !!type && !!id && !!isAuthenticated,
  });

  // TRAILER
  const {
    data: trailer,
    isLoading: isTrailerLoading,
    refetch: fetchTrailer,
  } = useQuery({
    queryKey: ["trailer", type, id],
    queryFn: () => getMediaTrailerById(type, id),
    enabled: false,
    retry: 1,
  });

  const media = data?.media;
  const staff = data?.staff;

  const handleWatchTrailer = async () => {
    const result = await fetchTrailer();

    if (result.data) {
      setIsTrailerOpen(true);
      return;
    }

    if (result.isError) {
      showError("Trailer unavailable right now.");
      return;
    }

    showError("No trailer available for this title.");
  };

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
              <button
                className={css.primaryButton}
                type="button"
                onClick={handleWatchTrailer}
                disabled={isTrailerLoading}
                aria-busy={isTrailerLoading}
              >
                {isTrailerLoading ? "Finding trailer..." : "Watch trailer"}
              </button>

              <FavButton
                size="big"
                id={String(media.id)}
                type={media.media_type}
              />

              <UserRating id={id} type={type} />
            </div>
          </div>
        </div>

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

        <UserReviewSection id={id} type={type} />
      </section>

      {isTrailerOpen && trailer && (
        <TrailerPlayer
          videoKey={trailer.key}
          title={trailer.name}
          tmdbId={media.id}
          type={media.media_type}
          startSeconds={watchHistory?.progress_seconds ?? 0}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </main>
  );
}
