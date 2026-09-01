import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "../../../_utils/utils";
import { GetMediaByIdResponse } from "@/lib/api/clientApi";

type Params = {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { movieId, type } = await params;
    const res = await api.get<GetMediaByIdResponse>(`/${type}/${movieId}`);

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
