import { NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { createApiResponse, errorCatcher } from "../../_utils/utils";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const searchParams = req.nextUrl.searchParams;

    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "12";
    const all = searchParams.get("all");

    const res = await api.get("/profile/favorites", {
      params: {
        page,
        limit,
        ...(all ? { all } : {}),
      },
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
