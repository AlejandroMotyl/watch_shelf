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

    const res = await api.get<MediaTrailerResponse>(
      `/${media_type}/${tmdbId}/trailer`,
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
