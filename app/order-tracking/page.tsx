"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CircleHelp,
  Download,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

type Product = { id: number; name: string; category: string; price: number; image: string; description: string };
type Item = { product: Product; qty: number; size: string };
type SavedOrder = {
  orderNumber: string;
  items: Item[];
  customer: { name: string; phone: string; email: string; city: string; area: string; road: string; house: string; notes: string };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  payment: string;
  delivery: string;
  placedAt: string;
};

const money = (amount: number) => "৳" + amount.toLocaleString("en-US");

export default function OrderTrackingPage() {
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tshoe-last-order");
      if (saved) setOrder(JSON.parse(saved));
    } catch {
      localStorage.removeItem("tshoe-last-order");
    } finally {
      setLoaded(true);
    }
  }, []);

  const orderId = order?.orderNumber || "NHK-89241";
  const orderTime = order ? new Date(order.placedAt).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" }) : "Today, 03:46 PM";
  const address = order ? [order.customer.house, order.customer.road, order.customer.area, order.customer.city].filter(Boolean).join(", ") : "House 12, Road 4, Sector 7, Uttara, Dhaka - 1230, Bangladesh";
  const totalItems = order?.items.reduce((sum, item) => sum + item.qty, 0) ?? 3;

  if (loaded && !order) {
    return (
      <main className="tracking-page">
        <header className="tracking-empty-header"><Link className="brand" href="/">T-SHOE<span className="green-dot">•</span></Link><Link href="/">Continue shopping</Link></header>
        <section className="tracking-no-order"><PackageCheck size={28} /><h1>No recent order found</h1><p>Place an order first, and your confirmation, package details, and live tracking timeline will appear here.</p><Link href="/" className="checkout-primary">BROWSE SNEAKERS</Link></section>
      </main>
    );
  }

  return (
    <main className="tracking-page">
      <div className="topline"><span>☎ HELPLINE: 01742528116</span><span>BANGLADESH EXPRESS DELIVERY</span><a href="#footer">▣ BECOME A SELLER</a><a href="#footer">♙ LOGIN TO SELLER</a></div>
      <header className="main-header">
        <Link className="brand" href="/"><span>T-SHOE<span className="green-dot">•</span></span><small>EST. BD</small></Link>
        <label className="searchbox"><span aria-hidden="true">⌕</span><input placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">SEARCH</button></label>
        <Link className="header-icon" href="/notifications" aria-label="Notifications">♧</Link>
        <Link className="header-icon account-button" href="/account">♙<small>ACCOUNT<br /><b>My Profile</b></small></Link>
        <Link className="cart-pill" href="/"><span>▣</span><span>CART<br /><b>৳0.00</b></span></Link>
      </header>
      <nav className="navline tracking-nav"><Link className="category-link" href="/">☷ &nbsp; Categories (See All)</Link>{["Home", "New Arrivals", "Sneakers", "Slides & Sandals", "Accessories", "Releases", "Stock Cleaness", "Upcoming"].map((item) => <Link href="/" key={item}>{item}</Link>)}<span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span></nav>

      <div className="tracking-wrap">
        {!loaded ? <div className="tracking-loading">Loading your order details…</div> : <>
          <section className="order-confirmation-banner">
            <div><span className="confirmation-kicker"><BadgeCheck size={12} /> AUTHENTICITY GUARANTEED &nbsp;·&nbsp; VERIFIED DROP</span><h1>Order Confirmed. Welcome to the Vault.</h1><p>Thank you! Your order has been placed successfully. A confirmation message and real-time tracking link have been dispatched via SMS &amp; WhatsApp to <b>{order?.customer.phone || "0170-121-345678"}</b>.</p><div className="confirmation-meta"><span>Order Reference: &nbsp;<b>#{orderId}</b></span><span>Ordered: &nbsp;<b>{orderTime}</b></span><span>Est. Delivery: &nbsp;<b>24 - 48 Hours</b></span></div></div>
            <div className="confirmation-actions"><button onClick={() => window.print()}><Download size={13} /> DOWNLOAD INVOICE (PDF)</button><Link href="/"><PackageCheck size={13} /> CONTINUE SHOPPING</Link></div>
          </section>

          <section className="tracking-timeline-panel">
            <div className="tracking-panel-heading"><div><span>◉ REAL-TIME PROGRESSION</span><h2>Live Order Tracking Timeline</h2></div><b><MapPin size={12} /> Rajshahi Central Authenticity Hub</b></div>
            <div className="tracking-timeline">
              {[{ title: "Order Confirmed", detail: "Payment verified & inventory allocated from verified tier-1 stock.", time: order ? "JUST NOW" : "03:45 PM", icon: <Check size={15} /> }, { title: "REID & Authentication", detail: "Leather gauge & stitching inspection under UV by senior sneakerhead.", time: "ACTIVE HUB", icon: <ShieldCheck size={15} /> }, { title: "Double-Box Packaging", detail: "Armor-seal exterior carton with tamper-proof Newke holographic seal.", time: "Pending", icon: <PackageCheck size={14} /> }, { title: "Dispatched to Transit", detail: "Handed over to Bangladesh Express Courier dedicated priority fleet.", time: "Pending", icon: <Truck size={14} /> }, { title: "Doorstep Delivery", detail: "Recipient physical check before signing final courier manifest.", time: "Pending", icon: <MapPin size={14} /> }].map((step, index) =>
                <article className={`timeline-step ${index === 0 ? "step-done" : index === 1 ? "step-active" : ""}`} key={step.title}><div className="timeline-step-top"><span>{step.icon}</span><small>{step.time}</small></div><label>STEP 0{index + 1}</label><h3>{step.title}</h3><p>{step.detail}</p></article>)}
            </div>
            <div className="inspection-note"><span><ShieldCheck size={15} /></span><p><b>Inspection Note by Lead Authenticator (Badge #BD-109)</b><small>&quot;Silhouette shape, inner tongue label font, and reverse swoosh symmetry authenticated 100%. RFID chip embedded.&quot;</small></p><button onClick={() => window.print()}>VIEW CHECK REPORT</button></div>
          </section>

          <section className="tracking-details">
            <div className="tracking-items-column"><div className="tracking-section-heading"><h2>Package Contents ({totalItems} Items)</h2><span>DIRECT DROP</span></div>
              {order?.items.length ? order.items.map((item) => <article className="package-item" key={`${item.product.id}-${item.size}`}><img src={item.product.image} alt={item.product.name} /><div><small>{item.product.category.toUpperCase()} / LIMITED</small><h3>{item.product.name}</h3><p>Size: EU {item.size} / US {item.size} &nbsp; Qty: {item.qty}</p></div><div><b>Verified</b><strong>{money(item.product.price * item.qty)}</strong><del>{money(Math.round(item.product.price * item.qty * 1.12))}</del></div></article>) : <article className="package-item"><img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=320&q=85" alt="Jordan sneaker" /><div><small>JORDAN RETRO / LIMITED</small><h3>Travis Scott x Air Jordan 1 Low OG</h3><p>Size: EU 42 / US 8.5 &nbsp; SKU: DM7866-140 &nbsp; Qty: 1</p></div><div><b>Verified</b><strong>৳7,200</strong><del>৳9,000</del></div></article>}
              {!order && <p className="tracking-empty-note">Your latest order details will appear here after checkout.</p>}
            </div>
            <aside className="tracking-side-column"><section className="billing-card"><div className="tracking-section-heading"><h2>Delivery &amp; Billing Info</h2><Truck size={14} /></div><small>SHIPPING ADDRESS</small><p>{address}</p><div className="billing-meta"><span>RECIPIENT CONTACT<b>{order?.customer.phone || "+880 1712-345678"}</b></span><span>PAYMENT METHOD<b>{order?.payment || "Cash on Delivery / bKash"}</b></span></div><div className="billing-lines"><span>Items Subtotal <b>{money(order?.subtotal ?? 8200)}</b></span><span>VIP Sneaker Club Discount <b>-{money(order?.discount ?? 380)}</b></span><span>Express Insured Shipping <b>{order?.shipping ? money(order.shipping) : "৳0 (Free)"}</b></span><span>RFID Holographic Authentication Fee <b className="green-text">Complimentary</b></span></div><div className="billing-total"><b>Total Payable</b><strong>{money(order?.total ?? 7820)}</strong></div></section>
              <section className="store-reward"><div><Store size={15} /><b>STORE PRIVILEGE<br /><strong>Free Ultrasonic Cleaning</strong></b></div><p>Show this order reference (#{orderId}) at our Rajshahi (Alakar Mor) or Bogura (Jaleshwaritola) flagship outlets to receive free ultrasonic sneaker restoration anytime within 6 months.</p><span>• RAJSHAHI HUB &nbsp; • BOGURA OUTLET</span></section></aside>
          </section>
          <section className="tracking-help"><CircleHelp size={17} /><span><b>Need assistance with this order?</b><small>Our sneaker dispatch team is available from 10:00 AM to 10:00 PM every day.</small></span><a href="https://wa.me/8801300714517">WhatsApp Concierge</a><a href="tel:01742528116">☎ Helpline: 01742528116</a></section>
        </>}
      </div>
      <footer className="catalog-footer" id="footer"><div className="footer-grid"><div><Link className="brand footer-brand" href="/">T-SHOE<span className="green-dot">•</span></Link><p>Bangladesh&apos;s premiere authentic sneaker and urban streetwear marketplace. Sourcing genuine hype silhouettes, limited editions, luxury slides, and street essentials direct from global distributors.</p><div className="support-box"><small>CUSTOMER SUPPORT HOTLINE</small><b>☎ 01300714517</b><span>Available 10:00 AM–10:00 PM (Everyday)</span></div></div><div><h4>BRANCH OUTLETS</h4><b>◉ RAJSHAHI OUTLET</b><p>Shop 104, Level 1, Alakar Mor, Ghoramara, Rajshahi-6100, Bangladesh</p><b>◉ BOGURA OUTLET</b><p>Holding 42, Jaleshwaritola Main Road, Bogura Sadar, Bogura-5800</p></div><div><h4>QUICK NAVIGATION</h4><Link href="/">About T-Shoe</Link><Link href="/">Authenticity Guarantee</Link><Link href="/order-tracking">Track Your Order</Link><Link href="/">Shipping &amp; Exchange</Link></div><div><h4>SELLER ZONE &amp; CONNECT</h4><Link href="/account">My Account</Link><Link href="/notifications">Notifications</Link><a href="mailto:seller@t-shoe.com">Seller Center Portal</a></div></div><div className="copyright"><span>© 2026 T-Shoe. All rights reserved. &nbsp; Privacy Policy &nbsp; · &nbsp; Terms of Service</span><span>TRUSTED PAYMENT: &nbsp; BKASH &nbsp; NAGAD &nbsp; VISA &nbsp; MASTERCARD &nbsp; COD</span></div></footer>
      <Link className="tracking-back" href="/"><ArrowLeft size={13} /> Back to store</Link>
    </main>
  );
}
