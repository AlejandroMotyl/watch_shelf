import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { getMediaByIdServer } from "@/lib/api/serverApi";
import CatalogueIdPageClient from "./CatalogueIdPageClient";

type CatalogueIdPageProps = {
  params: Promise<{
    type: "movie" | "tv";
    movieId: number;
  }>;
};

export default async function CatalogueIdPage({
  params,
}: CatalogueIdPageProps) {
  const { type, movieId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["media", type, movieId],
    queryFn: () => getMediaByIdServer(type, movieId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogueIdPageClient type={type} id={movieId} />
    </HydrationBoundary>
  );
}
