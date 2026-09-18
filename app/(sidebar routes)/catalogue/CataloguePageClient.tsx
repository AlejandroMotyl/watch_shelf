"use client";

import Hero from "@/components/Hero/Hero";
import css from "./page.module.css";
import Trending from "@/components/Trending/Trending";
import ContinueWatch from "@/components/ContinueWatch/ContinueWatch";
import { useQuery } from "@tanstack/react-query";
import { getTrending, getWatchHistory } from "@/lib/api/clientApi";
import { useMediaFilterStore } from "@/lib/store/mediaFilterStore/mediaFilterStore";

export default function CataloguePageClient() {
  const filter = useMediaFilterStore((store) => store.filter);
  const { data, isLoading } = useQuery({
    queryKey: ["trending", filter],
    queryFn: () => getTrending(filter),
    refetchOnMount: false,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["homeHistory"],
    queryFn: () => getWatchHistory(),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.results?.length || !historyData) {
    return <div>No movies found.</div>;
  }
  return (
    <>
      <Hero media={data.results[0]} />
      <Trending media={data.results.slice(1)} />
      <ContinueWatch history={historyData.history} />
    </>
  );
}
