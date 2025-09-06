// middleware.js
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    const pathname = request.nextUrl.pathname;
    const collectionName = pathname.split("/").pop(); // subject ID
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("post_login_redirect_url", `/dashboard/add-subject/${collectionName}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
