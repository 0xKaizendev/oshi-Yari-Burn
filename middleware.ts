import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
// import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(request) {
    const pathname = request.nextUrl.pathname;

    // route protecting

    const token = await getToken({ req: request });

    const isAuth = !!token;

    const isAuthPage = pathname.startsWith("/login");
    const isAdminPage = pathname.startsWith("/admin");

    const sensitiveRoutes = ["/admin"];

    if (isAdminPage) {
      if (isAuth) return NextResponse.next();
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin"],
};
