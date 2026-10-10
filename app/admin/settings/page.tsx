import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminStoreSettings from "../../../components/AdminStoreSettings";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../server/admin/auth";
import {
  getStoreSettings,
  type StoreSettings
} from "../../../server/store/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }

  let settings: StoreSettings | null = null;
  let loadError = "";

  try {
    settings = await getStoreSettings();
  } catch (error) {
    console.error("Unable to load store settings", error);
    loadError = "Store settings are temporarily unavailable.";
  }

  return (
    <main className="admin-app">
      <AdminStoreSettings settings={settings} loadError={loadError} />
    </main>
  );
}
