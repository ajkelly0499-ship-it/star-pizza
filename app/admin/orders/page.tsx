import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminOrdersBoard from "../../../components/AdminOrdersBoard";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../server/admin/auth";
import { getAdminOrders, type AdminOrder } from "../../../server/admin/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }

  let orders: AdminOrder[] = [];
  let loadError = "";

  try {
    orders = await getAdminOrders();
  } catch (error) {
    console.error("Unable to load admin orders", error);
    loadError =
      "The order database is not available yet. Check the Neon connection and migrations.";
  }

  return (
    <main className="admin-app">
      <AdminOrdersBoard orders={orders} loadError={loadError} />
    </main>
  );
}
