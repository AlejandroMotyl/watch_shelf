"use client";

import { useEffect, useRef } from "react";
import YouTube, { type YouTubeProps, type YouTubePlayer } from "react-youtube";
import { saveWatchHistory } from "@/lib/api/clientApi";
import css from "./TrailerPlayer.module.css";

interface TrailerPlayerProps {
  videoKey: string;
  title: string;
  tmdbId: number;
  type: "movie" | "tv";
  startSeconds?: number;
  onClose: () => void;
}

export default function TrailerPlayer({
  videoKey,
  title,
  tmdbId,
  type,
  startSeconds = 0,
  onClose,
}: TrailerPlayerProps) {
  // !!!!! CHANGE STYLES
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const saveProgress = async () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const progressSeconds = Math.floor(player.getCurrentTime());
    const durationSeconds = Math.floor(player.getDuration());

    if (!durationSeconds) {
      return;
    }

    try {
      await saveWatchHistory({
        tmdbId,
        type,
        progressSeconds,
        durationSeconds,
      });
    } catch (error) {
      console.error("Failed to save watch history:", error);
    }
  };

  const startTracking = () => {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      saveProgress();
    }, 10_000);
  };

  const stopTracking = () => {
    if (!intervalRef.current) {
      return;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const handleStateChange: YouTubeProps["onStateChange"] = (event) => {
    // Playing
    if (event.data === 1) {
      startTracking();
    }

    // Paused
    if (event.data === 2) {
      stopTracking();
      saveProgress();
    }

    // Ended
    if (event.data === 0) {
      stopTracking();
      saveProgress();
    }
  };

  const handleClose = async () => {
    await saveProgress();
    stopTracking();
    onClose();
  };

  // Remember the element that opened the modal.
  useEffect(() => {
    previousActiveElementRef.current =
      document.activeElement as HTMLElement | null;

    closeButtonRef.current?.focus();

    return () => {
      stopTracking();

      previousActiveElementRef.current?.focus();
    };
  }, []);

  // Escape closes the modal.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      rel: 0,
      start: Math.floor(startSeconds),
    },
  };

  return (
    <div
      className={css.overlay}
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trailer-title"
      >
        <div className={css.header}>
          <h2 id="trailer-title" className={css.title}>
            {title}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className={css.closeButton}
            onClick={handleClose}
            aria-label="Close trailer"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className={css.playerWrapper}>
          <YouTube
            videoId={videoKey}
            opts={opts}
            onReady={handleReady}
            onStateChange={handleStateChange}
            className={css.youtube}
          />
        </div>
      </div>
    </div>
  );
}
