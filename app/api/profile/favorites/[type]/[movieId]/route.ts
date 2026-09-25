import { errorCatcher } from "@/app/api/_utils/utils";
import { api } from "@/app/api/api";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    type: string;
    movieId: string;
  }>;
};
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { movieId, type } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await api.delete(`/profile/favorites/${type}/${movieId}`, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    return errorCatcher(error);
  }
}
