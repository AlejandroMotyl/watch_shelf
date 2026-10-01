import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { getWatchHistoryServer } from "@/lib/api/serverApi";
import WatchedPageClient from "./WatchedPageClient";

export default async function WatchedPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["history", "collection"],
    queryFn: () => getWatchHistoryServer(1, 12),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WatchedPageClient />
    </HydrationBoundary>
  );
}
