import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "../../../_utils/utils";
import { GetMediaByIdResponse } from "@/lib/api/clientApi";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { tmdbId, media_type } = await params;
    const res = await api.get<GetMediaByIdResponse>(`/${media_type}/${tmdbId}`);

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
