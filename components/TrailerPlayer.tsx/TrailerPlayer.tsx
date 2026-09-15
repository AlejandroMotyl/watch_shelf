"use client";

import { useEffect, useRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import { saveWatchHistory } from "@/lib/api/clientApi";

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
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveProgress = async () => {
    const player = playerRef.current;

    if (!player) {
      console.log("No YouTube player");
      return;
    }

    const progressSeconds = Math.floor(player.getCurrentTime());
    const durationSeconds = Math.floor(player.getDuration());

    console.log("Saving history:", {
      tmdbId,
      type,
      progressSeconds,
      durationSeconds,
    });

    if (!durationSeconds) {
      console.log("No duration yet");
      return;
    }

    try {
      await saveWatchHistory({
        tmdbId,
        type,
        progressSeconds,
        durationSeconds,
      });

      console.log("History saved");
    } catch (error) {
      console.error("Failed to save watch history:", error);
    }
  };

  const startTracking = () => {
    if (intervalRef.current) return;

    console.log("Started tracking");

    intervalRef.current = setInterval(() => {
      saveProgress();
    }, 10_000);
  };

  const stopTracking = () => {
    if (!intervalRef.current) return;

    console.log("Stopped tracking");

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleReady: YouTubeProps["onReady"] = (event) => {
    console.log("YouTube ready");

    playerRef.current = event.target;
  };

  const handleStateChange: YouTubeProps["onStateChange"] = (event) => {
    console.log("YouTube state:", event.data);

    // 1 = playing
    if (event.data === 1) {
      startTracking();
    }

    // 2 = paused
    if (event.data === 2) {
      stopTracking();
      saveProgress();
    }

    // 0 = ended
    if (event.data === 0) {
      stopTracking();
      saveProgress();
    }
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const handleClose = async () => {
    await saveProgress();
    stopTracking();
    onClose();
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
    <div>
      <div>
        <h2>{title}</h2>

        <button type="button" onClick={handleClose}>
          Close
        </button>
      </div>

      <div>
        <YouTube
          videoId={videoKey}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />
      </div>
    </div>
  );
}
