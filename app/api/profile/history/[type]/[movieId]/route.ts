import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { GetMediaByIdResponse } from "@/lib/api/clientApi";
import { logErrorResponse } from "@/app/api/_utils/utils";
import { WatchHistory } from "@/types/history";
import { cookies } from "next/headers";

type Params = {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();

    const { movieId, type } = await params;
    const res = await api.get<WatchHistory>(
      `/profile/history/${type}/${movieId}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
