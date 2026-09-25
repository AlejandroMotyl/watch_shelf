import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { api } from "@/app/api/api";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    if (accessToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const apiRes = await api.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Cookie: req.headers.get("cookie") ?? "",
        },
      },
    );

    const response = NextResponse.json(
      { success: true },
      { status: apiRes.status },
    );

    const setCookies = apiRes.headers["set-cookie"];

    if (setCookies) {
      for (const setCookie of setCookies) {
        response.headers.append("set-cookie", setCookie);
      }
    }

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json({ success: false }, { status: 200 });
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    logErrorResponse({ message });

    return NextResponse.json({ success: false }, { status: 200 });
  }
}
