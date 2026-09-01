import CatalogueIdPageClient from "./CatalogueIdPageClient";

type CatalogueIdPageProps = {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
};

export default async function CatalogueIdPage({
  params,
}: CatalogueIdPageProps) {
  const { type, movieId } = await params;
  return <CatalogueIdPageClient type={type} id={movieId} />;
}
