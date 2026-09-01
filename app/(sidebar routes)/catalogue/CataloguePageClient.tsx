"use client";

import Hero from "@/components/Hero/Hero";
import css from "./page.module.css";
import Trending from "@/components/Trending/Trending";
import ContinueWatch from "@/components/ContinueWatch/ContinueWatch";
import { useQuery } from "@tanstack/react-query";
import { getTrending } from "@/lib/api/clientApi";
import { useMediaFilterStore } from "@/lib/store/mediaFilterStore/mediaFilterStore";

export default function CataloguePageClient() {
  const filter = useMediaFilterStore((store) => store.filter);
  const { data, isLoading } = useQuery({
    queryKey: ["trending", filter],
    queryFn: () => getTrending(filter),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.results?.length) {
    return <div>No movies found.</div>;
  }
  return (
    <>
      <Hero media={data.results[0]} />
      <Trending media={data.results.slice(1)} />
      <ContinueWatch />
    </>
  );
}
