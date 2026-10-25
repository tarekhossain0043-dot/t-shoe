"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collectionNavigation } from "../../lib/navigation";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Headset,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";

type Product = { id: number; name: string; category: string; price: number; image: string; description: string };
type Item = { product: Product; qty: number; size: string };
type Customer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  road: string;
  house: string;
  notes: string;
};

const money = (amount: number) => "৳" + amount.toLocaleString("en-US");
const deliveryOptions = [
  { name: "Inside Hub", title: "Inside Hub", detail: "Same-day VIP courier by Alakar More, Kazihata, Motihar, and surrounding areas.", price: 120, icon: "◉" },
  { name: "Inside Dhaka Metro", title: "Inside Dhaka Metro", detail: "Guaranteed 24-Hour Express delivery to Gulshan, Banani, Dhanmondi, Uttara & Mirpur.", price: 150, icon: "◉" },
  { name: "Nationwide", title: "Nationwide 64 Districts", detail: "Doorstep 2–3 Days Express fulfillment via Steadfast Logistics & Pathao Courier.", price: 200, icon: "◉" },
  { name: "Hub Pickup", title: "Flagship Hub Pickup", detail: "Inspect shoes on-site at Rajshahi Alakar Mor Flagship or Bogura Jamal Complex.", price: 0, icon: "⌂" },
];

export default function Checkout() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [payment, setPayment] = useState("bKash");
  const [delivery, setDelivery] = useState("Inside Dhaka Metro");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    city: "Dhaka",
    area: "",
    road: "",
    house: "",
    notes: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tshoe-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem("tshoe-cart");
    }
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = deliveryOptions.find((option) => option.name === delivery)?.price ?? 150;
  const total = Math.max(0, subtotal + shipping - discount);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const save = (next: Item[]) => {
    setItems(next);
    localStorage.setItem("tshoe-cart", JSON.stringify(next));
  };
  const field = (key: keyof Customer, value: string) => setCustomer((current) => ({ ...current, [key]: value }));

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (["TSHOE10", "NEWKE10", "NEWKEDHAKA10"].includes(code)) {
      const amount = Math.min(code === "NEWKEDHAKA10" ? 550 : 500, subtotal);
      setDiscount(amount);
      setNotice(`Promo voucher applied — ${money(amount)} discount`);
    } else {
      setDiscount(0);
      setNotice("That coupon code is not valid.");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) {
      setNotice("Your bag is empty. Add a pair before placing your order.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      localStorage.setItem("tshoe-checkout-draft", JSON.stringify({
        items,
        customer,
        address: [customer.house, customer.road, customer.area, customer.city, customer.notes ? `Delivery notes: ${customer.notes}` : ""].filter(Boolean).join(", "),
        subtotal,
        shipping,
        discount,
        couponCode: discount ? coupon.trim().toUpperCase() : "",
        delivery,
        paymentMethod: payment,
      }));
      router.push("/payment");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to continue to payment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="checkout-page express-checkout">
      <div className="express-topline">
        <span>☎ &nbsp; HELPLINE: 01742528116</span>
        <span>▣ &nbsp; Bangladesh Express Delivery</span>
        <a href="#seller">Become a Seller</a>
        <a href="#seller">Login to Seller</a>
      </div>
      <header className="express-header">
        <div className="header-brand-group"><Link className="express-logo" href="/"><b>T</b><span>T-SHOE<small>SHOE BD</small></span></Link></div>
        <label className="express-search"><span>⌕</span><input aria-label="Search products" placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">Search</button></label>
        <div className="header-actions"><Link className="express-header-action" href="/"><ShoppingBag /><span>{itemCount} ITEMS<br /><b>{money(subtotal)}</b></span></Link>
          <Link className="express-header-action verified-account" href="/"><BadgeCheck /><span>ACCOUNT<br /><b>Verified</b></span></Link></div>
      </header>
      <nav className="express-nav">
        <Link className="express-category" href="/">▦ &nbsp; CATEGORIES (SEE ALL)</Link>
        {collectionNavigation.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
        <span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span>
      </nav>

      <div className="express-crumb"><Link href="/">Home</Link><span>›</span><Link href="/">Cart</Link><span>›</span><b>Secure Checkout</b><span className="ssl-lock"><LockKeyhole size={11} /> 256-BIT SSL ENCRYPTED TUNNEL</span></div>
      <div className="checkout-steps">
        <div className="checkout-step complete"><span><Check size={13} /></span><small>STEP 01<br /><b>Bag & Cart</b></small></div><i />
        <div className="checkout-step current"><span>02</span><small><b>DELIVERY</b><br />Delivery & Shipping</small></div><i />
        <div className="checkout-step pending"><span>03</span><small>STEP 03<br />Payment & Review</small></div>
      </div>

      <form className="express-layout" onSubmit={submit}>
        <div className="express-main">
          <section className="express-panel instant-panel">
            <div className="express-section-label"><span>INSTANT EXPEDITED ACCESS</span><button type="button"><Zap size={12} /> Auto-Fills Data</button></div>
            <div className="express-payment-shortcuts">
              {[{ title: "bKash 1-Tap", value: "bKash" }, { title: "Nagad 1-Tap", value: "Nagad" }, { title: "Standard Form", value: null }].map((option) =>
                <button type="button" key={option.title} className={option.value === payment ? "shortcut-active" : ""} onClick={() => { if (option.value) setPayment(option.value); }}>{option.title}</button>)}
            </div>
            <div className="form-divider"><span>OR ENTER DELIVERY DETAILS</span></div>
          </section>

          <section className="express-panel">
            <div className="express-panel-title"><span className="panel-icon"><Phone size={14} /></span><h2>Recipient Contact Profile</h2><b className="member-tag">VERIFIED MEMBER</b></div>
            <div className="express-form-grid">
              <label>FULL LEGAL NAME <em>*</em><span className="input-wrap"><input required autoComplete="name" value={customer.name} onChange={(event) => field("name", event.target.value)} placeholder="Your full name" /><CheckCircle2 size={13} /></span></label>
              <label>BANGLADESH PHONE (+880) <em>*</em><span className="input-wrap"><input required pattern="[0-9+ -]{8,18}" autoComplete="tel" value={customer.phone} onChange={(event) => field("phone", event.target.value)} placeholder="+880 17XXXXXXXX" /><Phone size={13} /></span></label>
              <label className="full-width">EMAIL ADDRESS FOR DIGITAL INVOICE & NFC TAG TOKEN <em>*</em><span className="label-aside">PDF Receipt sent instantly</span><span className="input-wrap"><input required type="email" autoComplete="email" value={customer.email} onChange={(event) => field("email", event.target.value)} placeholder="you@example.com" /><Mail size={13} /></span></label>
            </div>
          </section>

          <section className="express-panel">
            <div className="express-panel-title"><span className="panel-icon"><Truck size={14} /></span><h2>Select Delivery Zone &amp; Speed</h2><b className="district-tag">ALL 64 DISTRICTS ACTIVE</b></div>
            <div className="express-delivery-grid">{deliveryOptions.map((option) =>
              <label key={option.name} className={`express-delivery-option ${delivery === option.name ? "delivery-selected" : ""}`}>
                <input type="radio" name="delivery-zone" checked={delivery === option.name} onChange={() => setDelivery(option.name)} />
                <span className="delivery-option-copy"><b>{option.title}</b><small>{option.detail}</small><em>{option.name === "Hub Pickup" ? "▣ Immediate Handover · Fitting" : "● Dispatched with tracking"}</em></span>
                <strong>{option.price ? money(option.price) : "৳0 FREE"}</strong>
                {option.name === "Hub Pickup" && <i className="popular-tag">POPULAR</i>}
              </label>)}</div>
          </section>

          <section className="express-panel address-panel">
            <div className="express-panel-title"><span className="panel-icon"><MapPin size={14} /></span><h2>Physical Street Address</h2></div>
            <div className="express-form-grid">
              <label>DISTRICT / DIVISION <em>*</em><select required value={customer.city} onChange={(event) => field("city", event.target.value)}>{["Dhaka", "Rajshahi", "Bogura", "Chattogram", "Khulna", "Rangpur", "Mymensingh", "Sylhet", "Barishal"].map((city) => <option key={city}>{city}</option>)}</select></label>
              <label>THANA / SUB-DISTRICT / AREA <em>*</em><input required value={customer.area} onChange={(event) => field("area", event.target.value)} placeholder="e.g. Banani / Gulshan 2" /></label>
              <label>ROAD, SECTOR OR BLOCK <em>*</em><input required value={customer.road} onChange={(event) => field("road", event.target.value)} placeholder="Road 11, Block D" /></label>
              <label>HOUSE / HOLDING / FLAT NUMBER <em>*</em><input required value={customer.house} onChange={(event) => field("house", event.target.value)} placeholder="House 45/A, Flat 3B" /></label>
              <label className="full-width notes-field">DELIVERY NOTES &amp; SECURITY GATE INSTRUCTIONS <span className="label-aside">Optional</span><textarea value={customer.notes} onChange={(event) => field("notes", event.target.value)} placeholder="e.g. Ring bell 3B, call 10 minutes prior to delivery, leave with lobby security..." /></label>
            </div>
          </section>

          <div className="express-form-actions"><Link href="/" className="return-cart"><ArrowLeft size={14} /> Return to Cart</Link><button type="submit" disabled={busy || !items.length} className="continue-payment">{busy ? "PLEASE WAIT…" : "Continue to Payment & Review"} <ArrowRight size={15} /></button></div>
          {notice && <p className="express-notice" role="alert">{notice}</p>}
        </div>

        <aside className="express-aside">
          <section className="express-panel express-summary">
            <div className="summary-header"><h2><ShoppingBag size={15} /> Order Summary</h2><b>{itemCount} ITEMS</b></div>
            {items.length === 0 ? <div className="express-empty">Your bag is empty. <Link href="/">Browse sneakers →</Link></div> : items.map((item) =>
              <div className="express-summary-item" key={`${item.product.id}-${item.size}`}>
                <img src={item.product.image} alt={item.product.name} />
                <span className="summary-quantity">{item.qty}</span>
                <div><small>{item.product.category.toUpperCase()}</small><b>{item.product.name}</b><span>Size: EU {item.size} / US {item.size}</span></div>
                <strong>{money(item.product.price * item.qty)}<del>{money(Math.round(item.product.price * item.qty * 1.12))}</del><button type="button" onClick={() => save(items.filter((row) => row !== item))} aria-label={`Remove ${item.product.name}`}><Trash2 size={12} /></button></strong>
              </div>)}
            <div className="express-coupon"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="PROMO VOUCHER" aria-label="Promo voucher" /><button type="button" onClick={applyCoupon}>{discount ? <CheckCircle2 size={13} /> : "Apply"}</button></div>
            {notice && <p className="coupon-notice" role="status">{notice}</p>}
            <div className="express-totals"><div><span>Subtotal ({itemCount} verified pairs)</span><b>{money(subtotal)}</b></div><div><span>Shipping Fee ({delivery})</span><b>{money(shipping)}</b></div><div className="voucher-line"><span>♧ Promo Voucher {discount > 0 ? coupon.toUpperCase() : ""}</span><b>- {money(discount)}</b></div><div className="express-grand-total"><span><b>Grand Total</b><small>Inclusive of all duties &amp; tax</small></span><strong>{money(total)}</strong></div></div>
          </section>
          <section className="protocol-card"><h3><ShieldCheck size={15} /> PROTOCOL STANDARD<br /><small>Physical UV &amp; NFC Seal</small></h3><p>Every sneaker in this shipment undergoes microscopic stitch inspection, weight benchmarking, UV box stamp check, and encrypted NFC tag activation before sealing.</p><div><BadgeCheck size={13} /> Guaranteed Authentic or 200% Money Back</div></section>
          <section className="concierge-card"><span><Headset size={16} /></span><div><b>DIRECT CONCIERGE</b><strong>01742528116</strong><small>WhatsApp support 10am–11pm</small></div><a href="tel:01742528116" aria-label="Call concierge"><MessageCircle size={14} /> Call</a></section>
        </aside>
      </form>

      <footer className="express-footer">
        <div className="express-footer-grid">
          <div><Link className="express-logo footer-logo" href="/"><b>T</b><span>T-SHOE BD</span></Link><p>Bangladesh's premium curated destination for authentic sneakers, slides, limited edition releases, and modern streetwear footwear. Direct sourcing and verifiable authentication standard on every drop.</p><b className="footer-hotline">CUSTOMER HOTLINE 24/7<br /><strong>01300714517</strong></b><small>Support: help@newkeshoe.com</small></div>
          <div><h3>Branch Outlets</h3><b>RAJSHAHI OUTLET</b><p>Holding 142, Level 2, Alakar More, Station Road, Rajshahi - 6000</p><b>BOGURA OUTLET</b><p>Shop 24-26, Ground Floor, Jamal Shopping Complex, Bogura, Bogura - 5800</p></div>
          <div><h3>Quick Links</h3><Link href="/">Home</Link><Link href="/">New Arrivals</Link><Link href="/">Sneakers Showcase</Link><Link href="/">Latest Drops</Link><Link href="/">Order Tracking</Link><Link href="/">Authentication Protocol</Link></div>
          <div id="seller"><h3>Seller Zone</h3><Link href="/">Become a Seller</Link><Link href="/">Seller Portal Login</Link><Link href="/">Consignment Guidelines</Link><Link href="/">Terms of Service</Link><Link href="/">Privacy Policy</Link></div>
        </div>
        <div className="express-footer-bottom"><span>PAYMENT METHODS: &nbsp; ▪ bKash &nbsp; ▪ Nagad &nbsp; ▪ VISA &nbsp; ▪ Mastercard &nbsp; ▪ COD</span><span>© 2026 Newke Shoe Bangladesh (newkeshoe.com). All rights reserved.</span></div>
      </footer>
    </main>
  );
}
