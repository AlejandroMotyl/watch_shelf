import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "@/app/api/_utils/utils";
import { WatchHistory } from "@/types/history";

type Params = {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const { movieId, type } = await params;
    const res = await api.get<WatchHistory>(
      `/profile/history/${type}/${movieId}`,
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
