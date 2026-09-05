import { NextRequest, NextResponse } from "next/server";
import { parseCookie } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/add-recipe", "/profile"];
const publicRoutes = ["/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));

  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookie = data.headers["set-cookie"];

    if (setCookie) {
      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/catalogue", request.url))
        : NextResponse.next();

      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parseCookie(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed["Max-Age"]),
        };
        if (parsed.accessToken)
          response.cookies.set("accessToken", parsed.accessToken, options);
        if (parsed.refreshToken)
          response.cookies.set("refreshToken", parsed.refreshToken, options);
        if (parsed.sessionId)
          response.cookies.set("sessionId", parsed.sessionId, options);
      }

      return response;
    }

    // refresh failed
    return isPrivateRoute
      ? NextResponse.redirect(new URL("/auth/register", request.url))
      : NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return isPrivateRoute
      ? NextResponse.redirect(new URL("/auth/register", request.url))
      : NextResponse.next();
  }

  if (isPublicRoute)
    return NextResponse.redirect(new URL("/catalogue", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/auth/:path*"],
};
