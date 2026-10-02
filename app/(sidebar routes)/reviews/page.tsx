import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getReviewsServer } from "@/lib/api/serverApi";
import ReviewsPageClient from "./ReviewsPageClient";
import { Metadata } from "next";

const INITIAL_FILTER = "movie";
export const metadata: Metadata = {
  title: "Reviews",
};

export default async function ReviewsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["reviews", INITIAL_FILTER],
    queryFn: () => getReviewsServer(INITIAL_FILTER, 1),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsPageClient />
    </HydrationBoundary>
  );
}
