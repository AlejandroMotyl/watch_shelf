import { Media, Movie, TV } from "@/types/media";
import FavButton from "../favButton/favButton";
import css from "./Trending.module.css";
import { getPosterUrl } from "@/lib/services/mediaPosters";

import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import Link from "next/link";
import { useRef } from "react";
import { TMDB_MOVIE_GENRES } from "@/lib/constants/genreIds";

interface TrendingProps {
  media: Movie[] | TV[];
}

export default function Trending({ media }: TrendingProps) {
  const osRef = useRef<OverlayScrollbarsComponentRef>(null);
  const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null);
  return (
    <section className={css.trendingSection}>
      <h2 className={css.title}>Trending</h2>
      <OverlayScrollbarsComponent
        options={{
          scrollbars: { autoHide: "never", theme: "scrollbarTheme" },
          overflow: { x: "scroll", y: "hidden" },
        }}
        events={{
          initialized: (instance) => {
            const { viewport } = instance.elements();

            const onWheel = (e: WheelEvent) => {
              if (e.deltaY === 0) return;

              const canScroll = viewport.scrollWidth > viewport.clientWidth;
              if (!canScroll) return;

              e.preventDefault();
              viewport.scrollLeft += e.deltaY * 1.5;
            };

            wheelHandlerRef.current = onWheel;
            viewport.addEventListener("wheel", onWheel, { passive: false });
          },
          destroyed: (instance) => {
            const { viewport } = instance.elements();
            if (wheelHandlerRef.current) {
              viewport.removeEventListener("wheel", wheelHandlerRef.current);
              wheelHandlerRef.current = null;
            }
          },
        }}
        defer
      >
        <ul className={css.trendingList}>
          {media.map((media) => (
            <li
              className={css.trendingItem}
              key={media.id}
              style={{
                backgroundImage: `
  linear-gradient(
    to bottom,
    transparent 40%,
    var(--background) 100%
  ),
  url(${getPosterUrl(media.poster_path, "w500")})
`,
              }}
            >
              <FavButton size={"small"} />
              <Link
                className={css.trendingLink}
                href={`/catalogue/${media.media_type}/${media.id}`}
              >
                <div className={css.titleWrapper}>
                  <h3 className={css.mediaTitle}>
                    {media.media_type === "movie" ? media.title : media.name}
                  </h3>
                  <p className={css.description}>
                    {media.media_type === "movie"
                      ? media.release_date
                      : media.first_air_date}{" "}
                    |{" "}
                    {media.genre_ids
                      .map((id) => TMDB_MOVIE_GENRES[id])
                      .join(" • ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </OverlayScrollbarsComponent>
    </section>
  );
}
