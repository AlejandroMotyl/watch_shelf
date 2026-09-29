import { NextRequest } from "next/server";
import { createApiResponse, errorCatcher } from "../../_utils/utils";
import { api } from "../../api";

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const res = await api.patch("/profile/password", body, {
      headers: {
        Cookie: cookieHeader ?? "",
      },
    });

    return createApiResponse(res);
  } catch (error) {
    return errorCatcher(error);
  }
}
