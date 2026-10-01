import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTrendingServer } from "@/lib/api/serverApi";
import CataloguePageClient from "./CataloguePageClient";

const INITIAL_FILTER = "movie";

export default async function CataloguePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["trending", INITIAL_FILTER],
    queryFn: () => getTrendingServer(INITIAL_FILTER),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CataloguePageClient />
    </HydrationBoundary>
  );
}
