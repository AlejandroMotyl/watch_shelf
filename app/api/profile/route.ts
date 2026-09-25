export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";

import { errorCatcher } from "../_utils/utils";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const res = await api.get("/profile", {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const avatar = await req.formData();

    const res = await api.patch("/profile", avatar, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
