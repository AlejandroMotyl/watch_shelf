import { NextRequest, NextResponse } from "next/server";

import { api } from "../../api";
import { errorCatcher } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const res = await api.post("/profile/ratings", body, {
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
