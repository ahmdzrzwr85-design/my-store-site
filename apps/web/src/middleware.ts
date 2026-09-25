import { NextRequest, NextResponse } from "next/server";

const cookieName = "zz_admin_session";

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

async function isAdminSessionValid(token: string | undefined) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(signature),
      new TextEncoder().encode(payload),
    );
    if (!validSignature) return false;

    const session = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(payload)),
    );
    return session.isAdmin === true && session.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/admin/login";
  if (isLogin) return NextResponse.next();

  const allowed = await isAdminSessionValid(
    request.cookies.get(cookieName)?.value,
  );
  if (allowed) {
    const legacyRoutes: Record<string, string> = {
      "/Admin-Panel/pages/dashboard.html": "/admin",
      "/Admin-Panel/pages/products.html": "/admin/products",
      "/Admin-Panel/pages/categories.html": "/admin/categories",
      "/Admin-Panel/pages/stores.html": "/admin/stores",
      "/Admin-Panel/pages/offers.html": "/admin/offers",
      "/Admin-Panel/pages/analytics.html": "/admin/analytics",
    };
    const destination = legacyRoutes[pathname];
    return destination
      ? NextResponse.rewrite(new URL(destination, request.url))
      : NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/Admin-Panel/:path*"],
};
