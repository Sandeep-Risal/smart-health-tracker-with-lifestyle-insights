import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "path-to-regexp";
import { CookieKeys } from "./src/enums";
import { authRoutes } from "./src/constants";

export async function middleware(req: NextRequest) {
  const verify = req.cookies.get(CookieKeys.IS_LOGGED_IN)?.value;
  const url = req.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(url);

  // Check if the route is specifically the orders route and bypass further checks
  if (!verify && match("/reset/*path")(url)) {
    return NextResponse.next();
  }
  if (verify && match("/reset/*path")(url)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!verify && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (verify && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

/**
 * Add all the protected routes here in the matcher.
 */
// export const config = { matcher: ["/((?!.*\\.).*)", "/"] };
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
