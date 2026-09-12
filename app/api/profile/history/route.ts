import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "12";

    const res = await api.get("/profile/history", {
      params: {
        page,
        limit,
      },
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId};`,
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Get history proxy error:", error);

    return NextResponse.json(
      { message: "Failed to get watch history" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    const body = await request.json();

    const res = await api.post("/profile/history", body, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId};`,
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Save history proxy error:", error);

    return NextResponse.json(
      { message: "Failed to save watch history" },
      { status: 500 },
    );
  }
}
