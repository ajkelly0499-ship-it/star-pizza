import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../components/CartProvider";
import BasketDrawer from "../components/BasketDrawer";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Star Pizza Birstall | Delivery & Collection",
  description: "Fresh pizza, kebabs, burgers and more from Star Pizza Birstall."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <SiteFooter />
          <BasketDrawer />
        </CartProvider>
      </body>
    </html>
  );
}