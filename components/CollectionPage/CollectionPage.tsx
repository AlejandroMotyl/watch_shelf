"use client";

import FavButton from "@/components/favButton/favButton";
import css from "./CollectionPage.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getFavorites,
  getUserReviews,
  getWatchHistory,
} from "@/lib/api/clientApi";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import { TMDB_MOVIE_GENRES } from "@/lib/constants/genreIds";
import Link from "next/link";
import Image from "next/image";

interface CollectionPageProps {
  type: "Reviews" | "History" | "Favorites";
}

export default function CollectionPage({ type }: CollectionPageProps) {
  const isFavorites = type === "Favorites";
  const isHistory = type === "History";
  const isReviews = type === "Reviews";

  // FAVORITES
  const {
    data: favoritesData,
    isLoading: favoritesLoading,
    isFetchingNextPage: isFetchingFavoritesNextPage,
    hasNextPage: hasNextFavoritesPage,
    fetchNextPage: fetchNextFavoritesPage,
  } = useInfiniteQuery({
    queryKey: ["favorites", "collection"],
    queryFn: ({ pageParam }) => getFavorites(pageParam, 12),
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (
        typeof lastPage?.page !== "number" ||
        typeof lastPage?.total_pages !== "number"
      ) {
        return undefined;
      }

      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },

    enabled: isFavorites,
  });

  // HISTORY
  const {
    data: historyData,
    isLoading: historyLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["history", "collection"],
    queryFn: ({ pageParam }) => getWatchHistory(pageParam, 12),
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (
        typeof lastPage?.page !== "number" ||
        typeof lastPage?.total_pages !== "number"
      ) {
        return undefined;
      }

      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },

    enabled: isHistory,
  });

  // REVIEWS
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isFetchingNextPage: isFetchingReviewsNextPage,
    hasNextPage: hasNextReviewsPage,
    fetchNextPage: fetchNextReviewsPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", "collection"],
    queryFn: ({ pageParam }) => getUserReviews(pageParam, 12),
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (
        typeof lastPage?.page !== "number" ||
        typeof lastPage?.total_pages !== "number"
      ) {
        return undefined;
      }

      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },

    enabled: isReviews,
  });

  // Only show loading state for the active collection
  if (
    (isFavorites && favoritesLoading) ||
    (isHistory && historyLoading) ||
    (isReviews && reviewsLoading)
  ) {
    return <p>Loading...</p>;
  }

  // REVIEWS
  if (isReviews) {
    const reviews =
      reviewsData?.pages.flatMap((page) => page.reviews ?? []) ?? [];

    return (
      <section className={css.section}>
        <h1 className={css.sectionTitle}>My reviews</h1>

        {reviews.length === 0 ? (
          <div className={css.emptyState}>
            <h2>No reviews yet</h2>
            <p>Your movie and TV reviews will appear here.</p>
          </div>
        ) : (
          <>
            <ul className={css.reviewList}>
              {reviews.map((review) => (
                <li className={css.reviewItem} key={review.id}>
                  <Link
                    href={`/catalogue/${review.media_type}/${review.tmdb_id}`}
                    className={css.reviewLink}
                  >
                    <div className={css.reviewMedia}>
                      <div className={css.reviewPoster}>
                        {review.poster_path ? (
                          <Image
                            src={getPosterUrl(review.poster_path, "w185")}
                            alt={review.title}
                          />
                        ) : (
                          <div className={css.reviewPosterPlaceholder}>
                            No poster
                          </div>
                        )}
                      </div>

                      <div className={css.reviewDetails}>
                        <div className={css.reviewMeta}>
                          <span className={css.reviewMediaType}>
                            {review.media_type}
                          </span>

                          <span className={css.reviewDate}>
                            Updated{" "}
                            {new Date(review.updated_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className={css.reviewTitle}>{review.title}</h3>

                        <p className={css.description}>
                          {review.release_date?.slice(0, 4)}{" "}
                          {review.release_date &&
                            review.genres?.length > 0 &&
                            "| "}
                          {(review.genres ?? [])
                            .map((id) => TMDB_MOVIE_GENRES[id])
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      </div>
                    </div>

                    <p className={css.reviewContent}>{review.review_content}</p>
                  </Link>
                </li>
              ))}
            </ul>

            {hasNextReviewsPage && (
              <div className={css.loadMoreWrapper}>
                <button
                  type="button"
                  className={css.loadMoreButton}
                  onClick={() => fetchNextReviewsPage()}
                  disabled={isFetchingReviewsNextPage}
                >
                  {isFetchingReviewsNextPage ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  }

  // FAVORITES
  if (isFavorites) {
    const favorites =
      favoritesData?.pages.flatMap((page) => page.favorites ?? []) ?? [];

    return (
      <section className={css.section}>
        <h1 className={css.sectionTitle}>My favorites</h1>

        {favorites.length === 0 ? (
          <div className={css.emptyState}>
            <h2>No favorites yet</h2>
            <p>Movies and shows you favorite will appear here.</p>
          </div>
        ) : (
          <>
            <ul className={css.movieList}>
              {favorites.map((movie) => (
                <li
                  className={css.movieItem}
                  key={movie.id}
                  style={{
                    backgroundImage: `url(${getPosterUrl(
                      movie.poster_path,
                      "w500",
                    )})`,
                  }}
                >
                  <FavButton
                    size="small"
                    type={movie.media_type}
                    id={movie.tmdb_id}
                  />

                  <Link
                    href={`/catalogue/${movie.media_type}/${movie.tmdb_id}`}
                    className={css.movieLink}
                  >
                    <div className={css.titleWrapper}>
                      <h3 className={css.movieTitle}>{movie.title}</h3>

                      <p className={css.description}>
                        {movie.release_date?.slice(0, 4)} |{" "}
                        {(movie.genres ?? [])
                          .map((id) => TMDB_MOVIE_GENRES[id])
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {hasNextFavoritesPage && (
              <div className={css.loadMoreWrapper}>
                <button
                  type="button"
                  className={css.loadMoreButton}
                  onClick={() => fetchNextFavoritesPage()}
                  disabled={isFetchingFavoritesNextPage}
                >
                  {isFetchingFavoritesNextPage ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  }

  // HISTORY
  const history =
    historyData?.pages.flatMap((page) => page.history ?? []) ?? [];

  return (
    <section className={css.section}>
      <h1 className={css.sectionTitle}>My history</h1>

      {history.length === 0 ? (
        <div className={css.emptyState}>
          <h2>No watch history yet</h2>
          <p>Trailers you watch will appear here.</p>
        </div>
      ) : (
        <>
          <ul className={css.movieList}>
            {history.map((item) => {
              const progress =
                item.duration_seconds && item.duration_seconds > 0
                  ? Math.min(
                      (item.progress_seconds / item.duration_seconds) * 100,
                      100,
                    )
                  : 0;

              return (
                <li
                  className={css.movieItem}
                  key={item.id}
                  style={{
                    backgroundImage: `url(${getPosterUrl(
                      item.poster_path,
                      "w500",
                    )})`,
                  }}
                >
                  <FavButton
                    size="small"
                    type={item.media_type}
                    id={String(item.tmdb_id)}
                  />

                  <Link
                    href={`/catalogue/${item.media_type}/${item.tmdb_id}`}
                    className={css.movieLink}
                  >
                    <div className={css.titleWrapper}>
                      <h3 className={css.movieTitle}>{item.title}</h3>

                      <p className={css.description}>
                        {item.release_date?.slice(0, 4)} |{" "}
                        {(item.genres ?? [])
                          .map((id) => TMDB_MOVIE_GENRES[id])
                          .filter(Boolean)
                          .join(" • ")}
                      </p>

                      <p className={css.watchedDate}>
                        Watched {new Date(item.watched_at).toLocaleDateString()}
                      </p>

                      {item.duration_seconds && (
                        <div className={css.progressWrapper}>
                          <div className={css.progressBar}>
                            <div
                              className={css.progress}
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <span className={css.progressText}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {hasNextPage && (
            <div className={css.loadMoreWrapper}>
              <button
                type="button"
                className={css.loadMoreButton}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
