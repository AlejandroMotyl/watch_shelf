import Link from "next/link";
import css from "./Hero.module.css";
import FavButton from "../favButton/favButton";
import { Movie, TV } from "@/types/media";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import { TMDB_MOVIE_GENRES } from "@/lib/constants/genreIds";
interface HeroProps {
  media: TV | Movie;
}

export default function Hero({ media }: HeroProps) {
  const posterUrl = getPosterUrl(media.backdrop_path, "w1280");

  const genres = media.genre_ids.map((id) => TMDB_MOVIE_GENRES[id]);

  return (
    <section
      className={css.heroSection}
      style={{
        backgroundImage: `
    linear-gradient(
      to bottom,
      transparent 40%,
      var(--background) 100%
    ),
    url(${posterUrl})
  `,
      }}
    >
      <div className={css.titleWrapper}>
        <h1 className={css.title}>
          {media.media_type === "movie" ? media.title : media.name}
        </h1>
        <p className={css.description}>
          {media.media_type === "movie"
            ? media.release_date.slice(0, 4)
            : media.first_air_date.slice(0, 4)}{" "}
          | {genres.join(" ")} | Rating: {media.vote_average.toFixed(2)}
        </p>
      </div>
      <div className={css.buttonsWrapper}>
        <Link
          href={`/catalogue/${media.media_type}/${media.id}`}
          className={css.watchLink}
        >
          Watch now
        </Link>
        <FavButton size="big" />
      </div>
    </section>
  );
}
