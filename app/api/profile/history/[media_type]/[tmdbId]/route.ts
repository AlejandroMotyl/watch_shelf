import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "@/app/api/_utils/utils";
import { WatchHistory } from "@/types/history";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: number;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const { tmdbId, media_type } = await params;
    const res = await api.get<WatchHistory>(
      `/profile/history/${media_type}/${tmdbId}`,
      {
        headers: {
          Cookie: cookieHeader ?? "",
        },
      },
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
