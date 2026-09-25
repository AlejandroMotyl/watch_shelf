import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/login", body);

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      for (const cookie of setCookie) {
        response.headers.append("set-cookie", cookie);
      }
    }

    return response;
  } catch (error) {
    return errorCatcher(error);
  }
}
