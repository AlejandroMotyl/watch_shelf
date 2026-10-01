import { api } from "@/app/api/api";
import { createApiResponse, errorCatcher } from "@/app/api/_utils/utils";
import { WatchHistory } from "@/types/history";

type Params = {
  params: Promise<{
    media_type: string;
    tmdbId: string;
  }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const { tmdbId, media_type } = await params;
    const res = await api.get<WatchHistory>(
      `/profile/history/${media_type}/${tmdbId}`,
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
