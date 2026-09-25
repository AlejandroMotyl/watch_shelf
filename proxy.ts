import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile"];
const publicRoutes = ["/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));

  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookies = data.headers["set-cookie"];

    if (setCookies) {
      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/catalogue", request.url))
        : NextResponse.next();

      for (const setCookie of setCookies) {
        response.headers.append("set-cookie", setCookie);
      }

      return response;
    }

    return isPrivateRoute
      ? NextResponse.redirect(new URL("/auth/register", request.url))
      : NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return isPrivateRoute
      ? NextResponse.redirect(new URL("/auth/register", request.url))
      : NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/catalogue", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/auth/:path*"],
};
