import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { getUserReviewsServer } from "@/lib/api/serverApi";
import UserReviewsPageClient from "./UserReviewsPageClient";

export default async function ReviewsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["reviews", "collection"],
    queryFn: () => getUserReviewsServer(1, 12),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserReviewsPageClient />
    </HydrationBoundary>
  );
}
