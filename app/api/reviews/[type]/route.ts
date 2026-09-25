import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "../../_utils/utils";

type Params = {
  params: Promise<{
    type: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { type } = await params;

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";

    const res = await api.get(`/reviews/${type}`, {
      params: {
        page,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
