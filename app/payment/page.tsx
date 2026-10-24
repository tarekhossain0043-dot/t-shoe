"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Store, Wallet } from "lucide-react";
import { apiRequest } from "../../lib/auth";

type Product = { id: number; name: string; category: string; price: number; image: string; description: string };
type Item = { product: Product; qty: number; size: string };
type Draft = {
  items: Item[];
  customer: { name: string; phone: string; email: string; city: string; area: string; road: string; house: string; notes: string };
  address: string;
  subtotal: number;
  shipping: number;
  discount: number;
  delivery: string;
};
type PaymentMethod = "bKash" | "Nagad" | "Cash on Delivery" | "Bank Account";
type PaymentOption = { id: string; name: PaymentMethod; title: string; description: string; badge: string; accent: string };
const money = (amount: number) => "৳" + amount.toLocaleString("en-US");
const paymentOptions: PaymentOption[] = [
  { id: "bkash", name: "bKash", title: "bKash", description: "Payment gateway not connected", badge: "bK", accent: "bkash" },
  { id: "nagad", name: "Nagad", title: "Nagad", description: "Payment gateway not connected", badge: "N", accent: "nagad" },
  { id: "cod", name: "Cash on Delivery", title: "Cash on Delivery", description: "Pay the courier on delivery", badge: "৳", accent: "cod" },
  { id: "card", name: "Bank Account", title: "Debit / Credit Card", description: "Card processor not connected", badge: "▤", accent: "card" },
  { id: "outlet", name: "Cash on Delivery", title: "Outlet Pick & Pay", description: "Pay at Rajshahi or Bogura outlet", badge: "⌂", accent: "outlet" },
];

export default function PaymentPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState(paymentOptions[0].id);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");
  const itemCount = draft?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  const total = draft ? Math.max(0, draft.subtotal + draft.shipping - draft.discount) : 0;
  const selectedDetails = useMemo(() => paymentOptions.find((option) => option.id === selectedOptionId) ?? paymentOptions[0], [selectedOptionId]);
  const method = selectedDetails.name;

  useEffect(() => {
    try {
      const value = localStorage.getItem("tshoe-checkout-draft");
      if (value) setDraft(JSON.parse(value));
    } catch {
      localStorage.removeItem("tshoe-checkout-draft");
      setNotice("Checkout details could not be read. Please enter them again.");
    } finally {
      setLoaded(true);
    }
  }, []);

  async function placeOrder() {
    if (!draft || !draft.items.length) {
      setNotice("Your checkout is empty. Add an item and enter delivery details first.");
      return;
    }
    setBusy(true);
    setNotice("");
    let createdOrder = "";
    try {
      const result = await apiRequest<{ order_number: string; total: number; shipping_fee: number; discount: number }>("/orders/", {
        method: "POST",
        body: JSON.stringify({
          name: draft.customer.name,
          phone: draft.customer.phone,
          email: draft.customer.email,
          address: draft.address,
          city: draft.customer.city,
          payment_method: method,
          shipping_fee: draft.shipping,
          discount: draft.discount,
          delivery_method: draft.delivery,
          items: draft.items.map((item) => ({ product_id: item.product.id, quantity: item.qty, size: item.size })),
        }),
      });
      createdOrder = result.order_number;
      setCreatedOrderNumber(createdOrder);
      const savedOrder = {
        orderNumber: result.order_number,
        items: draft.items,
        customer: draft.customer,
        subtotal: draft.subtotal,
        shipping: result.shipping_fee,
        discount: result.discount,
        total: result.total,
        payment: method,
        status: "Processing",
        delivery: draft.delivery,
        placedAt: new Date().toISOString(),
      };
      const storedHistory = localStorage.getItem("tshoe-order-history");
      const history = storedHistory ? JSON.parse(storedHistory) as typeof savedOrder[] : [];
      localStorage.setItem("tshoe-order-history", JSON.stringify([savedOrder, ...history.filter((order) => order.orderNumber !== savedOrder.orderNumber)]));
      localStorage.setItem("tshoe-last-order", JSON.stringify(savedOrder));
      localStorage.removeItem("tshoe-checkout-draft");
      localStorage.removeItem("tshoe-cart");
      router.push("/orders");
    } catch (error) {
      setNotice(createdOrder
        ? `Order ${createdOrder} was created, but this browser could not save its local order history. Keep this reference and contact support.`
        : error instanceof Error ? error.message : "Unable to place your order. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loaded && !draft) {
    return <main className="payment-page"><header className="payment-header"><Link className="brand" href="/">T-SHOE<span className="green-dot">•</span></Link></header><section className="payment-empty"><Wallet size={27} /><h1>No checkout to pay for</h1><p>Choose your delivery details first. Your payment options will appear here.</p><Link href="/checkout" className="payment-confirm">CONTINUE TO DELIVERY</Link></section></main>;
  }

  return (
    <main className="payment-page">
      <div className="express-topline"><span>☎ &nbsp; HELPLINE: 01742528116</span><span>▣ &nbsp; Bangladesh Express Delivery</span><Link href="/account">My Account</Link><Link href="/orders">Order History</Link></div>
      <header className="express-header"><Link className="express-logo" href="/"><b>T</b><span>T-SHOE<small>SHOE BD</small></span></Link><div className="payment-header-secure"><LockKeyhole size={12} /> PAYMENT OPTIONS</div><Link className="express-header-action" href="/checkout"><Wallet /><span>{itemCount} ITEMS<br /><b>{money(total)}</b></span></Link></header>
      <nav className="express-nav payment-nav"><Link className="express-category" href="/brands">▦ &nbsp; CATEGORIES (SEE ALL)</Link>{["Home", "New Arrivals", "Sneakers", "Slides & Sandals", "Accessories", "Releases", "Stock Cleaness", "Upcoming"].map((label) => <Link key={label} href="/brands">{label}</Link>)}</nav>
      <div className="payment-crumb"><Link href="/">Home</Link><span>/</span><Link href="/checkout">Checkout</Link><span>/</span><b><LockKeyhole size={11} /> Payment Preference</b><span className="payment-reserved">ORDER TOTAL: {money(total)}</span></div>
      <section className="payment-intro"><div><h1>Select Payment Method <span><LockKeyhole size={10} /> SECURE ORDER CREATION</span></h1><p>Choose how you intend to pay. This store does not currently have a mobile-wallet or card gateway connected, so placing an order will not charge you or collect payment credentials.</p></div><div className="payment-order-total"><span>▤</span><div><small>{draft?.customer.name.toUpperCase()} · {draft?.customer.city.toUpperCase()}</small><b>{money(total)}</b><small>{itemCount} Item{itemCount === 1 ? "" : "s"}<br />Delivery included in total</small></div></div></section>
      <section className="payment-layout">
        <aside className="payment-channel-list"><h2>PAYMENT CHANNELS</h2>{paymentOptions.map((option) => <button key={option.id} type="button" className={`payment-channel ${selectedOptionId === option.id ? "channel-selected" : ""}`} onClick={() => setSelectedOptionId(option.id)}><span className={`payment-channel-badge ${option.accent}`}>{option.badge}</span><span><b>{option.title}</b><small>{option.description}</small></span>{selectedOptionId === option.id && <CheckCircle2 size={14} />}</button>)}</aside>
        <div className="payment-right-column">
          <section className="gateway-panel"><div className="gateway-heading"><span className={`payment-channel-badge ${selectedDetails.accent}`}>{selectedDetails.badge}</span><div><h2>{selectedDetails.title} payment preference</h2><small>Payment processing is not connected</small></div><b>NO ONLINE CHARGE</b></div>
            <div className="gateway-info"><ShieldCheck size={13} /><p>{method === "Cash on Delivery" ? "Your order will be recorded as cash on delivery. Pay the courier when your order arrives, or pay in person if you selected outlet pickup." : "No live payment gateway is configured. This records your preferred payment method only; no wallet transfer or card charge will be initiated."}</p></div>
            <div className="gateway-number gateway-method-note"><span>{method === "Bank Account" ? <CreditCard size={16} /> : method === "Cash on Delivery" ? <Store size={16} /> : <Wallet size={16} />}</span><span><small>Payment preference</small><b>{selectedDetails.title}</b></span></div>
            <p className="gateway-security-note"><LockKeyhole size={11} /> Never share your wallet PIN, OTP, or card details on this site. Payment credentials are not requested or stored.</p>
            <label className="payment-consent"><input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} /> I confirm the order total of <b>{money(total)}</b> and authorize T-SHOE to create this order.</label>
            <button className={`payment-confirm payment-confirm-${selectedDetails.accent}`} disabled={busy || !authorized || Boolean(createdOrderNumber)} onClick={placeOrder}>{busy ? "CREATING ORDER…" : createdOrderNumber ? `ORDER CREATED · #${createdOrderNumber}` : method === "Cash on Delivery" ? `PLACE COD ORDER · ${money(total)}` : `PLACE ORDER · ${money(total)}`}</button>
            {notice && <p className="payment-notice" role="alert">{notice} {createdOrderNumber && <Link href="/orders">View order history</Link>}</p>}
            <div className="payment-guarantee"><ShieldCheck size={13} /><span><b>100% Sourced Authentication Guarantee</b><small>Tamper-proof physical NFC tag linked to each individual shoe box</small></span><small>Helpline: 01742528116</small></div>
          </section>
          <section className="payment-protocol"><div><Banknote size={17} /><span><b>Payment processing status</b><small>This checkout records the order and your payment preference. Wallet and card payments must be completed later through an official, verified payment channel.</small></span></div><b>ORDER TOTAL<br /><small>{money(total)}</small></b></section>
        </div>
      </section>
      <footer className="express-footer"><div className="express-footer-grid"><div><Link className="express-logo footer-logo" href="/"><b>T</b><span>T-SHOE BD</span></Link><p>Bangladesh&apos;s premium curated destination for authentic sneakers, slides, limited edition releases, and modern streetwear footwear.</p></div><div><h3>Branch Outlets</h3><p>Rajshahi Outlet<br />Alakar Mor, Rajshahi</p><p>Bogura Outlet<br />Jaleshwaritola, Bogura</p></div><div><h3>Quick Links</h3><Link href="/">Home</Link><Link href="/orders">Order Tracking</Link><Link href="/brands">Sneakers Showcase</Link></div><div><h3>Account</h3><Link href="/account">My Account</Link><Link href="/notifications">Drop Alerts</Link></div></div><div className="express-footer-bottom"><span>PAYMENT METHODS: &nbsp; bKash &nbsp; Nagad &nbsp; VISA &nbsp; Mastercard &nbsp; COD</span><span>© 2026 T-SHOE Bangladesh. All rights reserved.</span></div></footer>
    </main>
  );
}
