import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "@/app/api/_utils/utils";

interface RouteContext {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { type, movieId } = await params;

    const cookieHeader = req.headers.get("cookie");
    const res = await api.get(`/profile/reviews/${type}/${movieId}`, {
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
