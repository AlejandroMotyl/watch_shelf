import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/_utils/utils";
import { MediaTrailerResponse } from "@/types/media";

type Params = {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { movieId, type } = await params;

    const res = await api.get<MediaTrailerResponse>(
      `/${type}/${movieId}/trailer`,
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    logErrorResponse({
      message: (error as Error).message,
    });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
