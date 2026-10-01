"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import css from "./page.module.css";
import { getUserReviews } from "@/lib/api/clientApi";
import Link from "next/link";
import { TMDB_MEDIA_GENRES } from "@/lib/constants/genreIds";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import Image from "next/image";
import FetchError from "@/components/FetchError/FetchError";
import Loading from "@/components/Loading/Loading";

export default function UserReviewsPageClient() {
  const {
    data: reviewsData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
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
  });
  if (isLoading) {
    return <Loading size="large" />;
  }
  const reviews =
    reviewsData?.pages.flatMap((page) => page.reviews ?? []) ?? [];

  return (
    <section className={css.section}>
      <h1 className={css.sectionTitle}>My reviews</h1>

      {reviews.length === 0 ? (
        <FetchError title="No reviews yet, your movie and TV shows reviews will appear here" />
      ) : (
        <>
          <ul className={css.reviewList}>
            {reviews.map((review) => (
              <li className={css.reviewItem} key={review.id}>
                <Link
                  href={`/catalogue/${review.media_type}/${review.tmdb_id}`}
                  className={css.reviewCard}
                >
                  <div className={css.reviewMedia}>
                    <div className={css.reviewPoster}>
                      {review.poster_path ? (
                        <Image
                          src={getPosterUrl(review.poster_path, "w185")!}
                          alt={`${review.title} poster`}
                          width={185}
                          height={278}
                        />
                      ) : (
                        <div className={css.reviewPosterPlaceholder}>
                          No poster
                        </div>
                      )}
                    </div>

                    <div className={css.mediaInfo}>
                      <div className={css.mediaHeader}>
                        <div className={css.mediaText}>
                          <h2 className={css.mediaTitle}>{review.title}</h2>

                          <p className={css.mediaMeta}>
                            {review.release_date?.slice(0, 4)}
                            {review.release_date &&
                              review.genres?.length > 0 && (
                                <span className={css.metaSeparator}>•</span>
                              )}
                            {(review.genres ?? [])
                              .map((id) => TMDB_MEDIA_GENRES[id])
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        </div>

                        <span className={css.mediaType}>
                          {review.media_type}
                        </span>
                      </div>

                      <div className={css.reviewBox}>
                        <div className={css.reviewBoxHeader}>
                          <span className={css.reviewLabel}>Your review</span>
                          <div className={css.reviewActions}>
                            {review.is_favorite && (
                              <span
                                className={css.favoriteStatus}
                                aria-label="This title is in your favorites"
                              >
                                <svg
                                  className={css.favoriteIcon}
                                  aria-hidden="true"
                                >
                                  <use href="/sprite.svg#heart" />
                                  <use href="/sprite.svg#heart-filled" />
                                </svg>
                              </span>
                            )}
                            <span className={css.reviewRating}>
                              ★ {review.rating ?? "N/A"}
                            </span>
                          </div>
                        </div>

                        <p className={css.reviewText}>
                          {review.review_content}
                        </p>
                      </div>

                      <span className={css.reviewDate}>
                        Updated{" "}
                        {new Date(review.updated_at).toLocaleDateString()}
                      </span>
                    </div>
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
