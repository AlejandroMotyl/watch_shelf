import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "../../../_utils/utils";
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
    return errorCatcher(error);
  }
}
