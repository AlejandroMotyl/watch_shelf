import { NextRequest, NextResponse } from "next/server";
import { errorCatcher } from "../../_utils/utils";
import { api } from "../../api";

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const apiRes = await api.patch("/profile/password", body, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });
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
