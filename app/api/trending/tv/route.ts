import { NextResponse } from "next/server";
import { api } from "@/app/api/api";

import { errorCatcher } from "../../_utils/utils";

export async function GET() {
  try {
    const res = await api("trending/tv");
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return errorCatcher(error);
  }
}
