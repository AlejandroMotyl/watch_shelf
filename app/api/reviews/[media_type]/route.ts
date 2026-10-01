import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "../../_utils/utils";

type Params = {
  params: Promise<{
    media_type: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { media_type } = await params;
    if (media_type !== "movie" && media_type !== "tv") {
      return NextResponse.json(
        { message: "Invalid media type" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";

    const res = await api.get(`/reviews/${media_type}`, {
      params: {
        page,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
