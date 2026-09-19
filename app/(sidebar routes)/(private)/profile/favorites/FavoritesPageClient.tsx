"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import css from "./page.module.css";
import { getFavorites } from "@/lib/api/clientApi";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import FavButton from "@/components/favButton/favButton";
import Link from "next/link";
import { TMDB_MEDIA_GENRES } from "@/lib/constants/genreIds";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";

export default function FavoritesPageClient() {
  const {
    data: favoritesData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
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
  });

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
          <ul className={css.mediaList}>
            {favorites.map((media) => (
              <li
                className={css.mediaItem}
                key={media.id}
                style={{
                  backgroundImage: `url(${getPosterUrl(
                    media.poster_path,
                    "w500",
                  )})`,
                }}
              >
                <FavButton
                  size="small"
                  type={media.media_type}
                  id={media.tmdb_id}
                />

                <Link
                  href={`/catalogue/${media.media_type}/${media.tmdb_id}`}
                  className={css.mediaLink}
                >
                  <div className={css.titleWrapper}>
                    <h3 className={css.mediaTitle}>{media.title}</h3>

                    <p className={css.description}>
                      {media.release_date?.slice(0, 4)} |{" "}
                      {(media.genres ?? [])
                        .map((id) => TMDB_MEDIA_GENRES[id])
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
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
