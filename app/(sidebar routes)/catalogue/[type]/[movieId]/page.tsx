import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { getMediaByIdServer } from "@/lib/api/serverApi";
import CatalogueIdPageClient from "./CatalogueIdPageClient";
type CatalogueIdPageProps = {
  params: Promise<{
    type: "movie" | "tv";
    movieId: string;
  }>;
};
export async function generateMetadata({
  params,
}: CatalogueIdPageProps): Promise<Metadata> {
  const { type, movieId } = await params;

  try {
    const data = await getMediaByIdServer(type, Number(movieId));
    const media = data.media;

    const title = media.media_type === "movie" ? media.title : media.name;

    return {
      title,
      description: media.overview || `Discover ${title} on Watch Shelf.`,
      openGraph: {
        title: `${title} | Watch Shelf`,
        description: media.overview || `Discover ${title} on Watch Shelf.`,
        images: media.poster_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/w1280${media.poster_path}`,
                alt: title,
              },
            ]
          : ["/images/auth-bg.jpg"],
      },
    };
  } catch {
    return {
      title: "Media not found",
    };
  }
}

export default async function CatalogueIdPage({
  params,
}: CatalogueIdPageProps) {
  const { type, movieId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["media", type, movieId],
    queryFn: () => getMediaByIdServer(type, Number(movieId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogueIdPageClient type={type} id={Number(movieId)} />
    </HydrationBoundary>
  );
}
