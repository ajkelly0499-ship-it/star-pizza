import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminMenuManager from "../../../components/AdminMenuManager";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../server/admin/auth";
import {
  getAdminMenuProducts,
  type AdminMenuProduct
} from "../../../server/admin/menu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }

  let products: AdminMenuProduct[] = [];
  let loadError = "";

  try {
    products = await getAdminMenuProducts();
  } catch (error) {
    console.error("Unable to load admin menu", error);
    loadError = "Menu controls are temporarily unavailable.";
  }

  return (
    <main className="admin-app">
      <AdminMenuManager products={products} loadError={loadError} />
    </main>
  );
}
