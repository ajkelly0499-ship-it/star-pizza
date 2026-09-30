import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";

export default function DeliveryInfoPage() {
  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="page-hero info-page-hero">
        <div className="shell page-hero-grid">
          <div>
            <span className="page-eyebrow">DELIVERY & COLLECTION</span>
            <h1>Know before you order.</h1>
            <p>
              Everything customers need to find the shop, collect an order or start a delivery.
            </p>
          </div>
          <Link className="page-hero-link" href="/menu">
            Start an order <span>→</span>
          </Link>
        </div>
      </section>

      <section className="info-page-content">
        <div className="shell info-grid">
          <article className="info-card">
            <span>01</span>
            <h2>Delivery</h2>
            <p>
              Enter your postcode during checkout and the system will confirm whether
              the address is inside the delivery area before payment.
            </p>
          </article>

          <article className="info-card">
            <span>02</span>
            <h2>Collection</h2>
            <p>
              Order online and collect from Star Pizza, 11 Low Lane, Birstall,
              West Yorkshire, WF17 9EW.
            </p>
          </article>

          <article className="info-card">
            <span>03</span>
            <h2>Need help?</h2>
            <p>
              Call the takeaway directly if you need to discuss an order or have
              a question before checking out.
            </p>
            <a href="tel:01924477755">01924 477755</a>
          </article>
        </div>

        <div className="shell info-order-cta">
          <div>
            <span className="kicker">READY?</span>
            <h2>Food first. Fuss last.</h2>
          </div>
          <Link href="/menu">View menu <span>→</span></Link>
        </div>
      </section>
    </main>
  );
}