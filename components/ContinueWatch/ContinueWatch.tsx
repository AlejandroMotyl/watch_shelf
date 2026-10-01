"use client";

import css from "./ContinueWatch.module.css";
import FavButton from "../favButton/favButton";
import { getPosterUrl } from "@/lib/services/mediaPosters";
import Link from "next/link";
import { TMDB_MEDIA_GENRES } from "@/lib/constants/genreIds";
import { WatchHistory } from "@/types/history";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useRef, useState } from "react";
import FetchError from "../FetchError/FetchError";

interface ContinueWatchProps {
  history: WatchHistory[];
}

export default function ContinueWatch({ history }: ContinueWatchProps) {
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
    <section className={css.conWatchSection}>
      <h2 className={css.title}>Continue watching</h2>
      {history.length === 0 ? (
        <FetchError title="No watch history so far, trailers you've watched will appear here" />
      ) : (
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
                  viewport.removeEventListener(
                    "wheel",
                    wheelHandlerRef.current,
                  );

                  wheelHandlerRef.current = null;
                }

                viewport.removeEventListener("scroll", updateScrollState);
                viewportRef.current = null;
              },
            }}
            defer
          >
            <ul className={css.conWatchList}>
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
                          {item.genres
                            .map((id) => TMDB_MEDIA_GENRES[id])
                            .join(" • ")}
                        </p>

                        <p className={css.watchedDate}>
                          Watched{" "}
                          {new Date(item.watched_at).toLocaleDateString()}
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
          </OverlayScrollbarsComponent>

          <button
            type="button"
            className={`${css.arrowButton} ${
              canScrollLeft ? css.visible : ""
            } ${css.leftButton}`}
            aria-hidden={!canScrollLeft}
            tabIndex={canScrollLeft ? 0 : -1}
            onClick={() => scrollByDirection("left")}
            aria-label="Show previous continue watching items"
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
            aria-label="Show more continue watching items"
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
}
