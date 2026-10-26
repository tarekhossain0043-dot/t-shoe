"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collectionNavigation } from "../../lib/navigation";
import { ArrowDownToLine, Check, Clipboard, Copy, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { apiRequest, getCurrentMember } from "../../lib/auth";

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
  status: "Processing" | "In Transit" | "Completed" | "Cancelled";
  paymentStatus?: string;
  pickupOutlet?: string;
};
const money = (amount: number) => "৳" + amount.toLocaleString("en-US");

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [tab, setTab] = useState("All Orders");
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState("");
  const [loadError, setLoadError] = useState("");
  const [retryingOrder, setRetryingOrder] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let active = true;
    const readLocalHistory = () => {
      const history = JSON.parse(localStorage.getItem("tshoe-order-history") || "[]") as SavedOrder[];
      const latest = JSON.parse(localStorage.getItem("tshoe-last-order") || "null") as SavedOrder | null;
      const combined = latest && !history.some((order) => order.orderNumber === latest.orderNumber) ? [latest, ...history] : history;
      return combined.map((order) => ({ ...order, status: order.status || "Processing" }));
    };
    async function loadOrders() {
      try {
        const member = await getCurrentMember();
        if (member) {
          const response = await apiRequest<{ orders: SavedOrder[] }>("/orders/history/");
          if (!active) return;
          setOrders(response.orders);
          localStorage.setItem("tshoe-order-history", JSON.stringify(response.orders));
          setLoaded(true);
          return;
        }
        if (active) setOrders(readLocalHistory());
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Could not load your account order history.");
          try {
            setOrders(readLocalHistory());
          } catch {
            setOrders([]);
          }
        }
      } finally {
        if (active) setLoaded(true);
      }
    }
    void loadOrders();
    return () => {
      active = false;
    };
  }, []);

  const visibleOrders = useMemo(() => {
    if (tab === "All Orders") return orders;
    if (tab === "Processing & In-Transit") return orders.filter((order) => order.status === "Processing" || order.status === "In Transit");
    if (tab === "Completed") return orders.filter((order) => order.status === "Completed");
    return [];
  }, [orders, tab]);

  const copyTracking = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(id);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("copy-error");
    }
  };

  const reorder = (items: Item[]) => {
    try {
      const current = JSON.parse(localStorage.getItem("tshoe-cart") || "[]") as Item[];
      const next = [...current];
      items.forEach((item) => {
        const existing = next.find((line) => line.product.id === item.product.id && line.size === item.size);
        if (existing) existing.qty += item.qty;
        else next.push(item);
      });
      localStorage.setItem("tshoe-cart", JSON.stringify(next));
      window.location.href = "/checkout";
    } catch {
      setCopied("Could not restore this order to cart.");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" });

  async function retryPayment(order: SavedOrder) {
    const provider = order.payment === "bKash" ? "bkash" : order.payment === "Nagad" ? "nagad" : "";
    if (!provider) return;
    setRetryingOrder(order.orderNumber);
    setActionMessage("");
    try {
      const payment = await apiRequest<{ redirect_url: string }>(`/payments/${provider}/start/`, {
        method: "POST",
        body: JSON.stringify({ order_number: order.orderNumber }),
      });
      window.location.assign(payment.redirect_url);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not restart this payment. Please try again.");
      setRetryingOrder("");
    }
  }

  return (
    <main className="order-history-page">
      <div className="topline"><span>☎ HELPLINE: 01747295464</span><span>Bangladesh Express Delivery</span><Link href="/account">Become a Seller</Link><Link href="/account">Login to Seller</Link></div>
      <header className="main-header"><div className="header-brand-group"><Link className="brand" href="/"><span>T-SHOE<span className="green-dot">•</span></span><small>EST. BD</small></Link></div><label className="searchbox"><span>⌕</span><input placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">SEARCH</button></label><div className="header-actions"><Link className="header-icon" href="/notifications">♧</Link><Link className="header-icon account-button" href="/account">♙<small>ACCOUNT<br /><b>My Profile</b></small></Link><Link className="cart-pill" href="/checkout">▣<span>CART<br /><b>৳0.00</b></span></Link></div></header>
      <nav className="navline order-history-nav"><Link className="category-link" href="/brands">☷ &nbsp; Categories (See All)</Link>{collectionNavigation.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}<span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span></nav>
      <div className="order-history-breadcrumb"><Link href="/">Home</Link> / <Link href="/account">My Account</Link> / <b>Order History &amp; Tracking</b><span>◉ LIVE VAULT DISPATCH ACTIVE &nbsp; | &nbsp; Server Time: Dhaka (BST) GMT+6</span></div>
      <section className="member-order-banner"><div className="member-avatar">{orders[0]?.customer.name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("") || "TS"}<i>✓</i></div><div className="member-order-info"><h1>{orders[0]?.customer.name || "T-SHOE Member"} <span>ORDER HISTORY</span></h1><p>♙ &nbsp;{orders[0]?.customer.phone || "Order details are stored on this device"} &nbsp; · &nbsp; <MapPin size={11} /> {orders[0] ? `${orders[0].customer.area}, ${orders[0].customer.city}` : "Bangladesh"}</p></div><div className="order-stat"><small>ACTIVE ORDERS</small><b>{orders.filter((order) => order.status === "Processing" || order.status === "In Transit").length.toString().padStart(2, "0")} <i>Active</i></b></div><div className="order-stat"><small>TOTAL ORDERS</small><b>{orders.length.toString().padStart(2, "0")} <i>Lifetime</i></b></div><div className="order-stat"><small>PAYMENT STATUS</small><b>{orders[0]?.paymentStatus === "paid" ? "PAID · VERIFIED" : orders[0]?.paymentStatus?.toUpperCase() || "UNPAID"}</b></div></section>
      {loadError && <p className="order-history-toast" role="alert">Could not refresh orders from your account: {loadError}</p>}
      {actionMessage && <p className="order-history-toast" role="alert">{actionMessage}</p>}
      <div className="order-history-tabs">{["All Orders", "Processing & In-Transit", "Completed", "Returns & Exchanges"].map((item, index) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item} <span>{index === 0 ? orders.length : index === 1 ? orders.filter((order) => order.status === "Processing" || order.status === "In Transit").length : index === 2 ? orders.filter((order) => order.status === "Completed").length : 0}</span></button>)}</div>
      {!loaded ? <div className="order-history-empty">Loading your order history…</div> : visibleOrders.length ? <section className="order-history-list">{visibleOrders.map((order) => {
        const statusLabel = order.status === "In Transit" ? "IN TRANSIT" : order.status.toUpperCase();
        const completedStages = order.status === "Completed" ? 4 : order.status === "In Transit" ? 3 : 1;
        const count = order.items.reduce((sum, item) => sum + item.qty, 0);
        const address = [order.customer.house, order.customer.road, order.customer.area, order.customer.city].filter(Boolean).join(", ");
        return <article className="history-order-card" key={order.orderNumber}>
          <div className="history-reference-row"><div><small>ORDER REFERENCE</small><b>#{order.orderNumber} <button onClick={() => copyTracking(order.orderNumber)} aria-label="Copy order number">{copied === order.orderNumber ? <Check size={11} /> : <Copy size={11} />}</button></b></div><div><small>ORDER DATE</small><b>{formatDate(order.placedAt)}</b></div><div><small>DELIVERY ESTIMATE</small><b>{order.status === "Completed" ? "Delivered" : "To be confirmed"}</b></div><span className={`status-${order.status.toLowerCase().replace(" ", "-")}`}><i /> {statusLabel}</span></div>
          <div className="history-pipeline"><div className="pipeline-heading"><small>ORDER PROGRESS</small><span>Courier updates appear when available</span></div><div className="pipeline-steps">{[{ label: "Order Placed", detail: "Order received", icon: <Check size={13} /> }, { label: "Preparing", detail: "Awaiting update", icon: <PackageCheck size={13} /> }, { label: "In Transit", detail: "Awaiting update", icon: <Truck size={13} /> }, { label: "Delivered", detail: "Awaiting update", icon: <MapPin size={13} /> }].map((step, index) => <div className={index < completedStages ? "pipeline-step step-complete" : "pipeline-step"} key={step.label}><span>{step.icon}</span><b>{step.label}</b><small>{index < completedStages ? step.detail : "Pending"}</small></div>)}</div><div className="secure-inspection"><ShieldCheck size={13} /><span><b>Order confirmation received</b><small>Tracking reference: #{order.orderNumber}. Contact support if you need help with this order.</small></span></div></div>
          <div className="history-package"><small>ITEMS IN THIS PACKAGE ({count} ITEMS)</small><div>{order.items.map((item) => <article key={`${item.product.id}-${item.size}`}><img src={item.product.image} alt={item.product.name} /><span><small>{item.product.category.toUpperCase()}</small><b>{item.product.name}</b><small>Size: EU {item.size} &nbsp;·&nbsp; Qty: {item.qty}</small></span><strong>{money(item.product.price * item.qty)}<small>AUTHENTICATED</small></strong></article>)}</div></div>
          <div className="history-shipping"><span><small>{order.delivery === "Hub Pickup" ? "PICKUP LOCATION" : "SHIPPING DESTINATION"}</small><b>⌖ &nbsp;{order.pickupOutlet ? `${order.pickupOutlet} outlet` : address || order.customer.phone}</b></span><span><small>ORDER TOTAL ({order.payment.toUpperCase()} · {(order.paymentStatus || "unpaid").toUpperCase()})</small><b>{money(order.total)}</b></span></div>
          <div className="history-actions"><Link href="/order-tracking"><Truck size={12} /> Track Live Courier Location</Link><button onClick={() => window.print()}><ArrowDownToLine size={12} /> Download Tax Invoice (PDF)</button><button onClick={() => copyTracking(order.orderNumber)}><Clipboard size={12} /> {copied === order.orderNumber ? "Copied" : "Copy Order ID"}</button><button onClick={() => reorder(order.items)}>Buy Again</button>{order.paymentStatus !== "paid" && (order.payment === "bKash" || order.payment === "Nagad") && <button disabled={retryingOrder === order.orderNumber} onClick={() => void retryPayment(order)}>{retryingOrder === order.orderNumber ? "Opening payment…" : "Retry payment"}</button>}</div>
        </article>;
      })}</section> : <section className="order-history-empty"><PackageCheck size={24} /><b>No orders in this section</b><span>{tab === "All Orders" ? "Your completed purchases will appear here after checkout." : "There are no orders that match this filter."}</span><Link href="/brands">Browse the collection</Link></section>}
      {copied === "copy-error" && <p className="order-history-toast">Could not copy automatically. Please select the order reference.</p>}
      <section className="history-help-banner"><span><Truck size={17} /></span><div><b>Real-Time Hub Logistics &amp; Security Protocol</b><small>All authenticated footwear shipments departing our Rajshahi or Bogura fulfillment vaults undergo multi-spectrum ultraviolet seal testing and carry encrypted physical NFC chips before courier dispatch.</small></div><Link href="/notifications"><ShieldCheck size={12} /> View Authentication Process</Link></section>
      <section className="history-support"><span>♧</span><div><small>24/7 PRIORITY RESOLUTION</small><h2>Having issues with an order?</h2><p>Contact Rajshahi or Bogura central hubs directly at <a href="tel:01747295464">01747295464</a> or WhatsApp 24/7 for swift assistance.</p></div><a href="https://wa.me/8801747295464">WhatsApp Hub Manager</a><a href="tel:01747295464">☎ Call 01747295464</a></section>
      <footer className="catalog-footer"><div className="footer-grid"><div><Link className="brand footer-brand" href="/">T-SHOE<span className="green-dot">•</span></Link><p>Bangladesh&apos;s premium authentic sneaker marketplace.</p></div><div><h4>BRANCH OUTLETS</h4><p>Rajshahi · Alakar Mor<br />Bogura · Jaleshwaritola</p></div><div><h4>QUICK NAVIGATION</h4><Link href="/">Home</Link><Link href="/brands">Sneakers Showcase</Link><Link href="/notifications">Drop Alerts</Link></div><div><h4>SELLER ZONE</h4><Link href="/account">My Account</Link><Link href="/orders">Order Tracking</Link></div></div><div className="copyright">© 2026 T-SHOE. All rights reserved.</div></footer>
    </main>
  );
}
