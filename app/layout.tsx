import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}