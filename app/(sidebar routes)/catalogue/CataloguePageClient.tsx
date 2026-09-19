"use client";

import Hero from "@/components/Hero/Hero";
import css from "./page.module.css";
import Trending from "@/components/Trending/Trending";
import ContinueWatch from "@/components/ContinueWatch/ContinueWatch";
import { useQuery } from "@tanstack/react-query";
import { getTrending, getWatchHistory } from "@/lib/api/clientApi";
import { useMediaFilterStore } from "@/lib/store/mediaFilterStore/mediaFilterStore";
import { useAuthStore } from "@/lib/store/authStore/authStore";

export default function CataloguePageClient() {
  const filter = useMediaFilterStore((state) => state.filter);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading } = useQuery({
    queryKey: ["trending", filter],
    queryFn: () => getTrending(filter),
    refetchOnMount: false,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["homeHistory"],
    queryFn: () => getWatchHistory(),
    refetchOnMount: false,
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.results?.length || (isAuthenticated && !historyData)) {
    return <div>No movies found.</div>;
  }
  return (
    <>
      <Hero media={data.results[0]} />
      <Trending media={data.results.slice(1)} />
      {isAuthenticated && <ContinueWatch history={historyData!.history} />}
    </>
  );
}
