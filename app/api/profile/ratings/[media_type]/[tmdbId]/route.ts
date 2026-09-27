import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "@/app/api/_utils/utils";

type Params = {
  params: Promise<{
    media_type: "movie" | "tv";
    tmdbId: number;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { media_type, tmdbId } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await api.get(`/profile/ratings/${media_type}/${tmdbId}`, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    return errorCatcher(error);
  }
}
