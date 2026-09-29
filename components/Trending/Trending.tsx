"use client";

import { Movie, TV } from "@/types/media";
import FavButton from "../favButton/favButton";
import css from "./Trending.module.css";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { TMDB_MEDIA_GENRES } from "@/lib/constants/genreIds";

interface TrendingProps {
  media: Movie[] | TV[];
}

export default function Trending({ media }: TrendingProps) {
  const wheelHandlerRef = useRef<((event: WheelEvent) => void) | null>(null);
  const viewportRef = useRef<HTMLElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    setCanScrollLeft(viewport.scrollLeft > 1);

    setCanScrollRight(
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1,
    );
  };

  const scrollByDirection = (direction: "left" | "right") => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const amount = viewport.clientWidth * 0.8;

    viewport.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={css.trendingSection}>
      <h2 className={css.title}>Trending</h2>

      <div className={css.scrollWrapper}>
        <OverlayScrollbarsComponent
          options={{
            scrollbars: {
              autoHide: "never",
              theme: "scrollbarTheme",
            },
            overflow: {
              x: "scroll",
              y: "hidden",
            },
          }}
          events={{
            initialized: (instance) => {
              const { viewport } = instance.elements();

              viewportRef.current = viewport;

              const onWheel = (event: WheelEvent) => {
                if (event.deltaY === 0) return;

                const canScroll = viewport.scrollWidth > viewport.clientWidth;

                if (!canScroll) return;

                event.preventDefault();
                viewport.scrollLeft += event.deltaY * 1.5;
              };

              wheelHandlerRef.current = onWheel;

              viewport.addEventListener("wheel", onWheel, {
                passive: false,
              });

              viewport.addEventListener("scroll", updateScrollState);

              updateScrollState();
            },

            destroyed: (instance) => {
              const { viewport } = instance.elements();

              if (wheelHandlerRef.current) {
                viewport.removeEventListener("wheel", wheelHandlerRef.current);

                wheelHandlerRef.current = null;
              }

              viewport.removeEventListener("scroll", updateScrollState);
              viewportRef.current = null;
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
                <FavButton
                  size="small"
                  id={String(media.id)}
                  type={media.media_type}
                />

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
                        ? media.release_date.slice(0, 4)
                        : media.first_air_date.slice(0, 4)}{" "}
                      |{" "}
                      {media.genre_ids
                        .map((id) => TMDB_MEDIA_GENRES[id])
                        .join(" • ")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </OverlayScrollbarsComponent>

        <button
          type="button"
          className={`${css.arrowButton} ${
            canScrollLeft ? css.visible : ""
          } ${css.leftButton}`}
          aria-hidden={!canScrollLeft}
          tabIndex={canScrollLeft ? 0 : -1}
          onClick={() => scrollByDirection("left")}
          aria-label="Show previous trending media"
        >
          &lt;
        </button>

        <button
          type="button"
          className={`${css.arrowButton} ${
            canScrollRight ? css.visible : ""
          } ${css.rightButton}`}
          aria-hidden={!canScrollRight}
          tabIndex={canScrollRight ? 0 : -1}
          onClick={() => scrollByDirection("right")}
          aria-label="Show more trending media"
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
