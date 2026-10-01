import { api } from "@/app/api/api";
import { createApiResponse, errorCatcher } from "@/app/api/_utils/utils";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { media_type, tmdbId } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await api.get(`/profile/ratings/${media_type}/${tmdbId}`, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
