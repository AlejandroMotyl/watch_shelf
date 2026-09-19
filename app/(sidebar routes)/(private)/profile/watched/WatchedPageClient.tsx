"use client";
import Link from "next/link";
import css from "./page.module.css";
import { TMDB_MEDIA_GENRES } from "@/lib/constants/genreIds";
import FavButton from "@/components/favButton/favButton";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getWatchHistory } from "@/lib/api/clientApi";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";

export default function WatchedPageClient() {
  const {
    data: historyData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    // !!!! DOESNT ADD INTO HISTORY IMMEDIATELY AFTER WATCHING

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
  });

  const history =
    historyData?.pages.flatMap((page) => page.history ?? []) ?? [];

  return (
    <section className={css.section}>
      <h1 className={css.sectionTitle}>My history</h1>

      {/* //!PROPER STYLES FOR EMPTY */}
      {history.length === 0 ? (
        <div className={css.emptyState}>
          <h2 className={css.emptyStateHeader}>No watch history yet</h2>
          <p className={css.emptyStateText}>
            Trailers you watch will appear here.
          </p>
        </div>
      ) : (
        <>
          <ul className={css.mediaList}>
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
                  className={css.mediaItem}
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
                    className={css.mediaLink}
                  >
                    <div className={css.titleWrapper}>
                      <h3 className={css.mediaTitle}>{item.title}</h3>

                      <p className={css.description}>
                        {item.release_date?.slice(0, 4)} |{" "}
                        {(item.genres ?? [])
                          .map((id) => TMDB_MEDIA_GENRES[id])
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
            <LoadMoreBtn
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </>
      )}
    </section>
  );
}
