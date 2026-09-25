import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { errorCatcher } from "@/app/api/_utils/utils";

type Params = {
  params: Promise<{
    type: "movie" | "tv";
    id: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { type, id } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await api.get(`/profile/ratings/${type}/${id}`, {
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
