import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";

type Params = {
  params: Promise<{
    type: "movie" | "tv";
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { type, id } = await params;

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    const res = await api.get(`/profile/ratings/${type}/${id}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId};`,
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Get rating proxy error:", error);

    return NextResponse.json(
      { message: "Failed to get rating" },
      { status: 500 },
    );
  }
}
