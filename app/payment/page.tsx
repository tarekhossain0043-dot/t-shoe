"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collectionNavigation } from "../../lib/navigation";
import { useRouter } from "next/navigation";
import { Banknote, CheckCircle2, LockKeyhole, ShieldCheck, Store, Wallet } from "lucide-react";
import { apiRequest, getCurrentMember } from "../../lib/auth";

type Product = { id: number; name: string; category: string; price: number; image: string; description: string };
type Item = { product: Product; qty: number; size: string };
type Draft = {
  items: Item[];
  customer: { name: string; phone: string; email: string; city: string; area: string; road: string; house: string; notes: string };
  address: string;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode: string;
  delivery: string;
  paymentMethod?: string;
};
type PaymentMethod = "bKash" | "Nagad" | "Cash on Delivery" | "Outlet Pick & Pay";
type PaymentOption = { id: string; name: PaymentMethod; title: string; description: string; badge: string; accent: string; available: boolean };
const money = (amount: number) => "৳" + amount.toLocaleString("en-US");
const paymentOptions: PaymentOption[] = [
  { id: "bkash", name: "bKash", title: "bKash", description: "Secure bKash sandbox checkout", badge: "bK", accent: "bkash", available: true },
  { id: "nagad", name: "Nagad", title: "Nagad", description: "Secure Nagad sandbox checkout", badge: "N", accent: "nagad", available: true },
  { id: "cod", name: "Cash on Delivery", title: "Cash on Delivery", description: "Pay the courier on delivery", badge: "৳", accent: "cod", available: true },
  { id: "card", name: "Cash on Delivery", title: "Debit / Credit Card", description: "Not available yet", badge: "▤", accent: "card", available: false },
  { id: "outlet", name: "Outlet Pick & Pay", title: "Outlet Pick & Pay", description: "Pay at Rajshahi or Bogura outlet", badge: "⌂", accent: "outlet", available: true },
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
  const [pickupOutlet, setPickupOutlet] = useState("");
  const itemCount = draft?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  const total = draft ? Math.max(0, draft.subtotal + draft.shipping - draft.discount) : 0;
  const selectedDetails = useMemo(() => paymentOptions.find((option) => option.id === selectedOptionId) ?? paymentOptions[0], [selectedOptionId]);
  const method = selectedDetails.name;
  const outletPickupUnavailable = method === "Outlet Pick & Pay" && draft?.delivery !== "Hub Pickup";
  const missingPickupOutlet = method === "Outlet Pick & Pay" && !pickupOutlet;

  useEffect(() => {
    try {
      const value = localStorage.getItem("tshoe-checkout-draft");
      if (value) {
        const savedDraft = JSON.parse(value) as Draft;
        setDraft(savedDraft);
        const paymentOption = paymentOptions.find((option) => option.name === savedDraft.paymentMethod);
        if (paymentOption?.available) setSelectedOptionId(paymentOption.id);
      }
      const pending = localStorage.getItem("tshoe-pending-payment");
      if (pending) {
        const saved = JSON.parse(pending) as { orderNumber: string; paymentMethod: PaymentMethod };
        setCreatedOrderNumber(saved.orderNumber);
        setSelectedOptionId(saved.paymentMethod === "Nagad" ? "nagad" : "bkash");
      }
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
    if (outletPickupUnavailable) {
      setNotice("Choose Hub Pickup on the delivery step before selecting outlet payment.");
      return;
    }
    if (missingPickupOutlet) {
      setNotice("Choose a Rajshahi or Bogura pickup outlet.");
      return;
    }
    setBusy(true);
    setNotice("");
    let createdOrder = "";
    try {
      if (method === "bKash" || method === "Nagad") {
        const member = await getCurrentMember();
        if (!member) {
          setNotice("Sign in or create an account before paying with bKash or Nagad.");
          return;
        }
      }
      if (createdOrderNumber && (method === "bKash" || method === "Nagad")) {
        const gateway = method === "bKash" ? "bkash" : "nagad";
        const payment = await apiRequest<{ redirect_url: string }>(`/payments/${gateway}/start/`, {
          method: "POST",
          body: JSON.stringify({ order_number: createdOrderNumber }),
        });
        localStorage.removeItem("tshoe-pending-payment");
        localStorage.removeItem("tshoe-checkout-draft");
        localStorage.removeItem("tshoe-cart");
        window.location.assign(payment.redirect_url);
        return;
      }
      const result = await apiRequest<{ order_number: string; total: number; shipping_fee: number; discount: number; payment_status: string }>("/orders/", {
        method: "POST",
        body: JSON.stringify({
          name: draft.customer.name,
          phone: draft.customer.phone,
          email: draft.customer.email,
          address: draft.address,
          city: draft.customer.city,
          payment_method: method,
          pickup_outlet: method === "Outlet Pick & Pay" ? pickupOutlet : "",
          coupon_code: draft.couponCode,
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
        paymentStatus: result.payment_status,
        pickupOutlet: method === "Outlet Pick & Pay" ? pickupOutlet : "",
        status: "Processing",
        delivery: draft.delivery,
        placedAt: new Date().toISOString(),
      };
      const storedHistory = localStorage.getItem("tshoe-order-history");
      const history = storedHistory ? JSON.parse(storedHistory) as typeof savedOrder[] : [];
      localStorage.setItem("tshoe-order-history", JSON.stringify([savedOrder, ...history.filter((order) => order.orderNumber !== savedOrder.orderNumber)]));
      localStorage.setItem("tshoe-last-order", JSON.stringify(savedOrder));
      if (method === "bKash" || method === "Nagad") {
        localStorage.setItem("tshoe-pending-payment", JSON.stringify({ orderNumber: createdOrder, paymentMethod: method }));
        const gateway = method === "bKash" ? "bkash" : "nagad";
        const payment = await apiRequest<{ redirect_url: string }>(`/payments/${gateway}/start/`, {
          method: "POST",
          body: JSON.stringify({ order_number: createdOrder }),
        });
        localStorage.removeItem("tshoe-pending-payment");
        localStorage.removeItem("tshoe-checkout-draft");
        localStorage.removeItem("tshoe-cart");
        window.location.assign(payment.redirect_url);
      } else {
        localStorage.removeItem("tshoe-checkout-draft");
        localStorage.removeItem("tshoe-cart");
        router.push("/orders");
      }
    } catch (error) {
      setNotice(createdOrder
        ? `Order ${createdOrder} was created, but payment could not be started. Retry below or keep this reference. ${error instanceof Error ? error.message : ""}`
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
      <header className="express-header"><div className="header-brand-group"><Link className="express-logo" href="/"><b>T</b><span>T-SHOE<small>SHOE BD</small></span></Link></div><div className="payment-header-secure"><LockKeyhole size={12} /> PAYMENT OPTIONS</div><div className="header-actions"><Link className="express-header-action" href="/checkout"><Wallet /><span>{itemCount} ITEMS<br /><b>{money(total)}</b></span></Link></div></header>
      <nav className="express-nav payment-nav"><Link className="express-category" href="/brands">▦ &nbsp; CATEGORIES (SEE ALL)</Link>{collectionNavigation.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}</nav>
      <div className="payment-crumb"><Link href="/">Home</Link><span>/</span><Link href="/checkout">Checkout</Link><span>/</span><b><LockKeyhole size={11} /> Payment Preference</b><span className="payment-reserved">ORDER TOTAL: {money(total)}</span></div>
      <section className="payment-intro"><div><h1>Select Payment Method <span><LockKeyhole size={10} /> SECURE ORDER CREATION</span></h1><p>bKash and Nagad payments open their official hosted checkout. Sign in before starting an online payment. Never enter a wallet PIN or OTP on this store.</p></div><div className="payment-order-total"><span>▤</span><div><small>{draft?.customer.name.toUpperCase()} · {draft?.customer.city.toUpperCase()}</small><b>{money(total)}</b><small>{itemCount} Item{itemCount === 1 ? "" : "s"}<br />Delivery included in total</small></div></div></section>
      <section className="payment-layout">
        <aside className="payment-channel-list"><h2>PAYMENT CHANNELS</h2>{paymentOptions.map((option) => <button key={option.id} type="button" disabled={Boolean(createdOrderNumber) || !option.available} aria-disabled={!option.available} title={!option.available ? "Card payment is not connected yet." : undefined} className={`payment-channel ${selectedOptionId === option.id ? "channel-selected" : ""} ${!option.available ? "channel-unavailable" : ""}`} onClick={() => setSelectedOptionId(option.id)}><span className={`payment-channel-badge ${option.accent}`}>{option.badge}</span><span><b>{option.title}</b><small>{option.description}</small></span>{selectedOptionId === option.id && <CheckCircle2 size={14} />}</button>)}</aside>
        <div className="payment-right-column">
          <section className="gateway-panel"><div className="gateway-heading"><span className={`payment-channel-badge ${selectedDetails.accent}`}>{selectedDetails.badge}</span><div><h2>{selectedDetails.title} {method === "bKash" || method === "Nagad" ? "checkout" : "payment preference"}</h2><small>{method === "bKash" || method === "Nagad" ? "Provider-hosted sandbox checkout" : "Offline payment method"}</small></div><b>{method === "bKash" || method === "Nagad" ? "HOSTED CHECKOUT" : "NO ONLINE CHARGE"}</b></div>
            <div className="gateway-info"><ShieldCheck size={13} /><p>{method === "Cash on Delivery" ? "Your order will be recorded as cash on delivery. Pay the courier when your order arrives." : method === "Outlet Pick & Pay" ? "Collect your order from the selected T-SHOE outlet and pay in person. Hub Pickup must be selected for delivery." : "You will be redirected to the provider's hosted checkout. The server confirms the final transaction before marking the order paid."}</p></div>
            <div className="gateway-number gateway-method-note"><span>{method === "Cash on Delivery" || method === "Outlet Pick & Pay" ? <Store size={16} /> : <Wallet size={16} />}</span><span><small>{method === "Outlet Pick & Pay" ? "Payment location" : "Payment preference"}</small><b>{method === "Outlet Pick & Pay" && pickupOutlet ? `${selectedDetails.title} · ${pickupOutlet}` : selectedDetails.title}</b></span></div>
            {method === "Outlet Pick & Pay" && <label className="pickup-outlet-field">SELECT PICKUP OUTLET<select value={pickupOutlet} onChange={(event) => setPickupOutlet(event.target.value)}><option value="">Choose an outlet</option><option value="Rajshahi">Rajshahi — Alakar Mor</option><option value="Bogura">Bogura — Jaleshwaritola</option></select></label>}
            {outletPickupUnavailable && <p className="payment-notice" role="status">Outlet payment requires Hub Pickup. <Link href="/checkout">Change delivery method</Link></p>}
            <p className="gateway-security-note"><LockKeyhole size={11} /> Never share your wallet PIN, OTP, or card details on this site. Payment credentials are not requested or stored.</p>
            <label className="payment-consent"><input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} /> I confirm the order total of <b>{money(total)}</b> and authorize T-SHOE to create this order.</label>
            <button className={`payment-confirm payment-confirm-${selectedDetails.accent}`} disabled={busy || !authorized || outletPickupUnavailable || missingPickupOutlet} onClick={placeOrder}>{busy ? createdOrderNumber ? "OPENING GATEWAY…" : "CREATING ORDER…" : createdOrderNumber && (method === "bKash" || method === "Nagad") ? `RETRY PAYMENT · #${createdOrderNumber}` : method === "Cash on Delivery" ? `PLACE COD ORDER · ${money(total)}` : method === "Outlet Pick & Pay" ? `RESERVE AT ${pickupOutlet.toUpperCase()} OUTLET · ${money(total)}` : `PLACE ORDER · ${money(total)}`}</button>
            {notice && <p className="payment-notice" role="alert">{notice} {createdOrderNumber && <Link href="/orders">View order history</Link>} {(method === "bKash" || method === "Nagad") && <Link href="/account?next=%2Fpayment">Sign in</Link>}</p>}
            <div className="payment-guarantee"><ShieldCheck size={13} /><span><b>100% Sourced Authentication Guarantee</b><small>Tamper-proof physical NFC tag linked to each individual shoe box</small></span><small>Helpline: 01742528116</small></div>
          </section>
          <section className="payment-protocol"><div><Banknote size={17} /><span><b>Payment processing status</b><small>Wallet payments open the provider-hosted checkout and are marked paid only after server verification. Offline payment selections remain unpaid until collected.</small></span></div><b>ORDER TOTAL<br /><small>{money(total)}</small></b></section>
        </div>
      </section>
      <footer className="express-footer"><div className="express-footer-grid"><div><Link className="express-logo footer-logo" href="/"><b>T</b><span>T-SHOE BD</span></Link><p>Bangladesh&apos;s premium curated destination for authentic sneakers, slides, limited edition releases, and modern streetwear footwear.</p></div><div><h3>Branch Outlets</h3><p>Rajshahi Outlet<br />Alakar Mor, Rajshahi</p><p>Bogura Outlet<br />Jaleshwaritola, Bogura</p></div><div><h3>Quick Links</h3><Link href="/">Home</Link><Link href="/orders">Order Tracking</Link><Link href="/brands">Sneakers Showcase</Link></div><div><h3>Account</h3><Link href="/account">My Account</Link><Link href="/notifications">Drop Alerts</Link></div></div><div className="express-footer-bottom"><span>PAYMENT METHODS: &nbsp; bKash &nbsp; Nagad &nbsp; VISA &nbsp; Mastercard &nbsp; COD</span><span>© 2026 T-SHOE Bangladesh. All rights reserved.</span></div></footer>
    </main>
  );
}
