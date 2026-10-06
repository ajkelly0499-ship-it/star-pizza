import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminPassword
} from "../../../../server/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "login");

  if (action === "logout") {
    const response = redirectTo(request, "/admin");
    response.cookies.set(ADMIN_COOKIE, "", {
      ...adminCookieOptions,
      maxAge: 0
    });
    return response;
  }

  if (!isAdminConfigured()) {
    return redirectTo(request, "/admin?error=config");
  }

  const password = String(form.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    return redirectTo(request, "/admin?error=invalid");
  }

  const response = redirectTo(request, "/admin/orders");
  response.cookies.set(
    ADMIN_COOKIE,
    createAdminSessionToken(),
    adminCookieOptions
  );
  return response;
}
