import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    const res = await api("profile/favorites", {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId}; `,
      },
    });
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
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    const { id, type } = await req.json();

    console.log("Next.js favorite:", {
      type,
      id,
    });
    const res = await api.post(
      "/profile/favorites",
      { type, id },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId}; `,
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
