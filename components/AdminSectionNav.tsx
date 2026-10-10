import Link from "next/link";

type AdminSection = "orders" | "history" | "menu" | "settings";

export default function AdminSectionNav({ active }: { active: AdminSection }) {
  return (
    <nav className="admin-section-nav" aria-label="Restaurant admin sections">
      <div className="admin-section-nav-inner">
        <Link className={active === "orders" ? "active" : ""} href="/admin/orders">
          <span>Order Desk</span>
          <small>Live kitchen</small>
        </Link>
        <Link className={active === "history" ? "active" : ""} href="/admin/history">
          <span>History &amp; Sales</span>
          <small>Orders &amp; reporting</small>
        </Link>
        <Link className={active === "menu" ? "active" : ""} href="/admin/menu">
          <span>Menu &amp; Stock</span>
          <small>Availability controls</small>
        </Link>
        <Link className={active === "settings" ? "active" : ""} href="/admin/settings">
          <span>Store Settings</span>
          <small>Ordering controls</small>
        </Link>
      </div>
    </nav>
  );
}
