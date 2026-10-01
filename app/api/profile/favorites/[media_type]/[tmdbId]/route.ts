import { createApiResponse, errorCatcher } from "@/app/api/_utils/utils";
import { api } from "@/app/api/api";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { tmdbId, media_type } = await params;
    if (media_type !== "movie" && media_type !== "tv") {
      return NextResponse.json(
        { message: "Invalid media type" },
        { status: 400 },
      );
    }
    const cookieHeader = req.headers.get("cookie");

    const res = await api.delete(
      `/profile/favorites/${media_type}/${Number(tmdbId)}`,
      {
        headers: {
          Cookie: cookieHeader ?? "",
        },
      },
    );

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const { tmdbId, media_type } = await params;
    if (media_type !== "movie" && media_type !== "tv") {
      return NextResponse.json(
        { message: "Invalid media type" },
        { status: 400 },
      );
    }

    const res = await api.post(
      `/profile/favorites/${media_type}/${tmdbId}`,
      null,
      {
        headers: {
          Cookie: cookieHeader ?? "",
        },
      },
    );

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
