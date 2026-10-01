import { createApiResponse, errorCatcher } from "@/app/api/_utils/utils";
import { api } from "@/app/api/api";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { tmdbId, media_type } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await api.delete(`/profile/favorites/${media_type}/${tmdbId}`, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const { tmdbId, media_type } = await params;

    const res = await api.post(
      `/profile/favorites/${media_type}/${tmdbId}`,
      null,
      {
        headers: {
          Cookie: cookieHeader ?? "",
        },
      },
    );

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
