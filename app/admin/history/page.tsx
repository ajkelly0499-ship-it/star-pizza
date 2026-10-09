import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHistoryDashboard from "../../../components/AdminHistoryDashboard";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../server/admin/auth";
import { getAdminOrders, type AdminOrder } from "../../../server/admin/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminHistoryPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }

  let orders: AdminOrder[] = [];
  let loadError = "";

  try {
    orders = await getAdminOrders(1000);
  } catch (error) {
    console.error("Unable to load order history", error);
    loadError =
      "Order history is temporarily unavailable. Check the Neon connection.";
  }

  return (
    <main className="admin-app">
      <AdminHistoryDashboard orders={orders} loadError={loadError} />
    </main>
  );
}
