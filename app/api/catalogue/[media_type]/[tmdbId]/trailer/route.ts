import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "@/app/api/_utils/utils";
import { MediaTrailerResponse } from "@/types/media";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};
export async function GET(request: Request, { params }: Params) {
  try {
    const { tmdbId, media_type } = await params;
    if (media_type !== "movie" && media_type !== "tv") {
      return NextResponse.json(
        { message: "Invalid media type" },
        { status: 400 },
      );
    }

    const res = await api.get<MediaTrailerResponse>(
      `/${media_type}/${Number(tmdbId)}/trailer`,
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
