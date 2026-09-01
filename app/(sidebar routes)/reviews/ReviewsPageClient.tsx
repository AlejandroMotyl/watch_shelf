"use client";
import Link from "next/link";
import css from "./page.module.css";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/lib/api/clientApi";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import { useMediaFilterStore } from "@/lib/store/mediaFilterStore/mediaFilterStore";

export default function ReviewsPageClient() {
  const filter = useMediaFilterStore((store) => store.filter);
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", filter],
    queryFn: () => getReviews(filter),
    refetchOnMount: false,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.results?.length) {
    return <div>No medias found.</div>;
  }
  const reviews = data.results;
  return (
    <main className={css.reviewsPage}>
      <section className={css.reviewsSection}>
        <div className={css.pageHeader}>
          <h1 className={css.pageTitle}>Reviews</h1>
        </div>

        <ul className={css.reviewList}>
          {reviews.map((media) => (
            <li className={css.reviewCard} key={media.id}>
              <div className={css.mediaImageWrapper}>
                {media.poster ? (
                  <Image
                    className={css.mediaImage}
                    src={`${getPosterUrl(media.poster, "w1280")}`}
                    alt={`${media.title} poster`}
                    width={400}
                    height={600}
                    loading="eager"
                  />
                ) : (
                  <div>No poster available</div>
                )}
              </div>

              <div className={css.reviewContent}>
                <div className={css.mediaHeader}>
                  <div className={css.mediaText}>
                    <h2 className={css.mediaTitle}>{media.title}</h2>

                    <p className={css.mediaMeta}>
                      {media.year} <span className={css.metaSeparator}>•</span>
                    </p>
                  </div>
                  <Link
                    className={css.mediaLink}
                    href={`/catalogue/${filter}/${media.id}`}
                  >
                    View media
                  </Link>
                </div>

                <div className={css.reviewBox}>
                  <div className={css.reviewHeader}>
                    <span className={css.reviewLabel}>Best review</span>

                    <span className={css.reviewRating}>
                      ★ {media.review?.rating ?? "N/A"}
                    </span>
                  </div>

                  <p className={css.reviewText}>
                    {media.review?.text ?? "No review available."}
                  </p>

                  <span className={css.reviewAuthor}>
                    — {media.review?.author ?? "Unknown"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// !!!! ADD PAGINATION
