import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { createApiResponse, errorCatcher } from "@/app/api/_utils/utils";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { media_type, tmdbId } = await params;
    if (media_type !== "movie" && media_type !== "tv") {
      return NextResponse.json(
        { message: "Invalid media type" },
        { status: 400 },
      );
    }

    const cookieHeader = req.headers.get("cookie");
    const res = await api.get(`/profile/reviews/${media_type}/${tmdbId}`, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
