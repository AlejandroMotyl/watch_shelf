"use client";

import FavButton from "@/components/favButton/favButton";
import css from "./CollectionPage.module.css";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFavorites, getWatchHistory } from "@/lib/api/clientApi";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import { TMDB_MOVIE_GENRES } from "@/lib/constants/genreIds";

interface CollectionPageProps {
  type: "Reviews" | "History" | "Favorites";
}

export default function CollectionPage({ type }: CollectionPageProps) {
  const isFavorites = type === "Favorites";
  const isHistory = type === "History";

  // FAVORITES
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
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
    queryKey: ["history"],
    queryFn: ({ pageParam }) => getWatchHistory(pageParam, 12),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    enabled: isHistory,
  });

  if (favoritesLoading || historyLoading) {
    return <p>Loading...</p>;
  }

  // REVIEWS
  if (type === "Reviews") {
    return (
      <section className={css.section}>
        <h1 className={css.sectionTitle}>My reviews</h1>

        <div className={css.emptyState}>
          <h2>No reviews yet</h2>
          <p>Your movie and TV reviews will appear here.</p>
        </div>
      </section>
    );
  }

  // FAVORITES
  if (isFavorites) {
    const movies = favorites ?? [];

    return (
      <section className={css.section}>
        <h1 className={css.sectionTitle}>My favorites</h1>

        {movies.length === 0 ? (
          <div className={css.emptyState}>
            <h2>No favorites yet</h2>
            <p>Movies and shows you favorite will appear here.</p>
          </div>
        ) : (
          <ul className={css.movieList}>
            {movies.map((movie) => (
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

                <div className={css.titleWrapper}>
                  <h3 className={css.movieTitle}>{movie.title}</h3>

                  <p className={css.description}>
                    {movie.release_date?.slice(0, 4)} |{" "}
                    {movie.genres
                      .map((id) => TMDB_MOVIE_GENRES[id])
                      .join(" • ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  // HISTORY
  const history = historyData?.pages.flatMap((page) => page.history) ?? [];

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
                  <div className={css.titleWrapper}>
                    <h3 className={css.movieTitle}>{item.title}</h3>

                    <p className={css.description}>
                      {item.release_date?.slice(0, 4)} |{" "}
                      {item.genres
                        .map((id) => TMDB_MOVIE_GENRES[id])
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
