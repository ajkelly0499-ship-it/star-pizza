import Link from "next/link";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  return (
    <footer>
      <div className="shell footer-main">
        <div className="footer-brand-block">
          <Link className="brand footer-brand" href="/">
            <BrandMark />
            <div>
              <strong>STAR PIZZA</strong>
              <span>BIRSTALL</span>
            </div>
          </Link>
          <p>Fresh food prepared to order for delivery or collection in Birstall.</p>
        </div>

        <div className="footer-links">
          <strong>Order</strong>
          <Link href="/menu">Menu</Link>
          <Link href="/offers">Offers</Link>
          <Link href="/delivery-info">Delivery info</Link>
        </div>

        <div className="footer-links">
          <strong>Find us</strong>
          <span>11 Low Lane, Birstall</span>
          <a href="tel:01924477755">01924 477755</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Star Pizza Birstall</span>
        <span>Demo ordering experience</span>
      </div>
    </footer>
  );
}