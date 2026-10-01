import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import FavoritesPageClient from "./FavoritesPageClient";
import { getFavoritesServer } from "@/lib/api/serverApi";

export default async function FavoritesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["favorites", "collection"],
    queryFn: () => getFavoritesServer(1, 12),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesPageClient />
    </HydrationBoundary>
  );
}
