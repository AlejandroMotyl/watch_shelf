"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import css from "./page.module.css";
import { getUserReviews } from "@/lib/api/clientApi";
import Link from "next/link";
import { TMDB_MEDIA_GENRES } from "@/lib/constants/genreIds";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import Image from "next/image";

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
    return <p>Loading...</p>;
  }
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
                          src={getPosterUrl(review.poster_path, "w185")!}
                          alt={review.title}
                          width={185}
                          height={185}
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
                          .map((id) => TMDB_MEDIA_GENRES[id])
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
