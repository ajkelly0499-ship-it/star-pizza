"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import { useCart } from "./CartProvider";

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  const nav = [
    { href: "/menu", label: "Menu" },
    { href: "/offers", label: "Offers" },
    { href: "/delivery-info", label: "Delivery info" }
  ];

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>11 Low Lane, Birstall</span>
          <span className="utility-divider" />
          <span>Delivery & collection</span>
          <a href="tel:01924477755">01924 477755</a>
        </div>
      </div>

      <header className={overlay ? "site-header site-header--overlay" : "site-header site-header--solid"}>
        <div className="shell nav">
          <Link className="brand" href="/" aria-label="Star Pizza home">
            <BrandMark />
            <div>
              <strong>STAR PIZZA</strong>
              <span>BIRSTALL</span>
            </div>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button className="basket-button" onClick={openCart}>
            <span className="basket-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 8h12l-1 11H7L6 8Zm3-2a3 3 0 0 1 6 0v2H9V6Z" />
              </svg>
            </span>
            <span>Basket</span>
            <span className="basket-count">{itemCount}</span>
          </button>
        </div>
      </header>
    </>
  );
}