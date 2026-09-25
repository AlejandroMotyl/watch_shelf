import { NextRequest, NextResponse } from "next/server";
import { errorCatcher } from "../../_utils/utils";
import { api } from "../../api";

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const res = await api.patch("/profile/username", body, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
