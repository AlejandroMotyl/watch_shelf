import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("auth/register", body);

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    const setCookies = apiRes.headers["set-cookie"];

    if (setCookies) {
      for (const setCookie of setCookies) {
        response.headers.append("set-cookie", setCookie);
      }
    }

    return response;
  } catch (error) {
    return errorCatcher(error);
  }
}
