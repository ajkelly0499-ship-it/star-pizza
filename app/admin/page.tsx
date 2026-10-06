import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  verifyAdminSessionToken
} from "../../server/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  if (
    verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)
  ) {
    redirect("/admin/orders");
  }

  const { error } = await searchParams;
  const configured = isAdminConfigured();

  return (
    <main className="admin-app admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-star" aria-hidden="true">★</span>
          <div>
            <strong>STAR PIZZA</strong>
            <span>BIRSTALL · ORDER DESK</span>
          </div>
        </div>

        <span className="admin-eyebrow">RESTAURANT ADMIN</span>
        <h1>Run tonight&apos;s orders.</h1>
        <p>
          Sign in to accept orders and move them through the kitchen.
        </p>

        {!configured && (
          <div className="admin-alert admin-alert--warning">
            Admin access is not configured yet. Add ADMIN_PASSWORD and
            ADMIN_SESSION_SECRET to the Vercel environment.
          </div>
        )}

        {error === "invalid" && (
          <div className="admin-alert">That password was not recognised.</div>
        )}

        {error === "config" && configured && (
          <div className="admin-alert">
            Admin access could not be started. Please try again.
          </div>
        )}

        <form action="/api/admin/session" method="post" className="admin-login-form">
          <label>
            Admin password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter password"
              required
              disabled={!configured}
            />
          </label>
          <button type="submit" disabled={!configured}>
            Open order desk
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <small>
          Customer details and order controls are protected behind this sign-in.
        </small>
      </section>
    </main>
  );
}
