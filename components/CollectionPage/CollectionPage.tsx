"use client";

import FavButton from "@/components/favButton/favButton";
import css from "./CollectionPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/lib/api/clientApi";

interface CollectionPageProps {
  type: "Reviews" | "History" | "Favorites";
}

export default function CollectionPage({ type }: CollectionPageProps) {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["Collection", type],
    queryFn: getFavorites,
    refetchOnMount: false,
  });

  if (isLoading || !movies) {
    return <p>Loading...</p>;
  }

  return (
    <section className={css.section}>
      <h1 className={css.sectionTitle}>My {type.toLowerCase()}</h1>

      <ul className={css.movieList}>
        {movies.map((movie) => (
          <li
            className={css.movieItem}
            key={movie.id}
            style={{
              backgroundImage: `url(${movie.poster_path})`,
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
                {movie.release_date} | {movie.genres}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
