"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  Flame,
  Headset,
  PackageCheck,
  Radio,
  Tag,
  TicketPercent,
  Truck,
} from "lucide-react";

type AlertKind = "drop" | "order" | "price" | "reward" | "delivered" | "upcoming";
type Alert = {
  id: number;
  kind: AlertKind;
  label: string;
  eyebrow: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  product?: { name: string; category: string; price: string; image: string; previous?: string };
  progress?: number;
  actions?: string[];
};

const initialAlerts: Alert[] = [
  { id: 1, kind: "drop", label: "NEW / DROP ALERT", eyebrow: "VIP PRIORITY ALLOCATED", title: "Travis Scott x AJ1 Low OG “Canary” Drop Announced!", message: "Registration for VIP priority raffle is now open until midnight. Available for Rajshahi & Bogura hub allocations with guaranteed direct verification seal.", time: "15 mins ago", unread: true, product: { name: "Air Jordan 1 Low OG SP", category: "AIR JORDAN X CACTUS JACK", price: "৳18,500", previous: "৳21,000", image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=320&q=85" }, actions: ["Join VIP Raffle", "View Sneaker"] },
  { id: 2, kind: "order", label: "ORDER UPDATE", eyebrow: "Transit Ready", title: "Order #NHK-89241 Authenticated & Double-Boxed", message: "Your pair of Travis Scott AJ1 Low has passed 100% physical UV and stitch inspection at Rajshahi Hub. Handed to Pathao Express with tamper-proof security zip lock.", time: "2 hours ago", unread: true, progress: 75, actions: ["Track Package", "View Inspection Sheet"] },
  { id: 3, kind: "price", label: "PRICE DROP ALERT", eyebrow: "Wishlist Match", title: "Nike Air Jordan 4 Retro White Cement Price Dropped 15%!", message: "An item on your wishlist is now ৳8,200 (was ৳9,500). Limited 3 pairs in EU 42 remaining in our stock clearance pool.", time: "Yesterday", unread: true, product: { name: "Air Jordan 4 Retro Cement", category: "JORDAN BRAND", price: "৳8,200", previous: "৳9,500", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=320&q=85" }, actions: ["Quick Add to Cart"] },
  { id: 4, kind: "reward", label: "FLASH REWARD", eyebrow: "New Privilege Unlocked", title: "You unlocked Sneakerhead Tier-2 Perks!", message: "Enjoy free ultrasonic shoe cleaning for 6 months at any Newke store location in Rajshahi or Bogura. Show your QR badge at the counter.", time: "2 days ago", unread: false, actions: ["View Member Passport"] },
  { id: 5, kind: "delivered", label: "ORDER DISPATCHED", eyebrow: "Delivered", title: "Order #NHK-88902 Delivered Successfully", message: "Your ASICS Novablast 5 has arrived at Sector 11, Uttara, Dhaka. Received and verified via signature.", time: "4 days ago", unread: false, actions: ["Leave a Review", "Download Invoice"] },
  { id: 6, kind: "upcoming", label: "UPCOMING DROP", eyebrow: "Release Calendar", title: "Adidas Adizero Evo SL Lightstrike launching this Saturday 10:00 AM", message: "Super lightweight speed runner featuring cutting-edge Lightstrike Pro cushioning. Very limited stock allocation across nationwide distribution.", time: "5 days ago", unread: false, product: { name: "Adizero Evo SL Lightstrike", category: "ADIDAS RUNNING", price: "৳12,900", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=320&q=85" }, actions: ["Set SMS Reminder"] },
];
const tabs = [
  { id: "all", name: "All", count: 7 },
  { id: "drop", name: "Drop Alerts & Releases", count: 3 },
  { id: "order", name: "Order Status", count: 2 },
  { id: "promotion", name: "Promotions & Offers", count: 2 },
  { id: "unread", name: "Unread Only", count: 0 },
] as const;

function AlertIcon({ kind }: { kind: AlertKind }) {
  if (kind === "drop") return <Flame />;
  if (kind === "order" || kind === "delivered") return <PackageCheck />;
  if (kind === "price") return <Tag />;
  if (kind === "reward") return <TicketPercent />;
  return <Clock3 />;
}

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [tab, setTab] = useState<string>("all");
  const [preferences, setPreferences] = useState([true, true, true]);
  const [notice, setNotice] = useState("");
  const unreadCount = alerts.filter((alert) => alert.unread).length;
  const filteredAlerts = useMemo(() => alerts.filter((alert) => {
    if (tab === "unread") return alert.unread;
    if (tab === "drop") return alert.kind === "drop" || alert.kind === "upcoming";
    if (tab === "order") return alert.kind === "order" || alert.kind === "delivered";
    if (tab === "promotion") return alert.kind === "price" || alert.kind === "reward";
    return true;
  }), [alerts, tab]);

  const markAllRead = () => setAlerts((current) => current.map((alert) => ({ ...alert, unread: false })));
  const action = (label: string) => {
    if (label === "Track Package") {
      window.location.href = "/order-tracking";
      return;
    }
    if (label === "View Sneaker" || label === "Quick Add to Cart") {
      window.location.href = "/#catalog";
      return;
    }
    if (label === "View Member Passport") {
      window.location.href = "/account";
      return;
    }
    setNotice(`${label} request saved. We will notify you when it is available.`);
  };

  return (
    <main className="notifications-page">
      <div className="topline"><span>☎ HELPLINE: 01742528116</span><span>BANGLADESH EXPRESS DELIVERY</span><a href="#footer">▣ BECOME A SELLER</a><a href="#footer">♙ LOGIN TO SELLER</a></div>
      <header className="main-header">
        <Link className="brand" href="/"><span>T-SHOE<span className="green-dot">•</span></span><small>EST. BD</small></Link>
        <label className="searchbox"><span aria-hidden="true">⌕</span><input placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">SEARCH</button></label>
        <Link className="header-icon" href="/notifications" aria-label="Notifications"><Bell size={18} /><sup>{unreadCount}</sup></Link>
        <Link className="header-icon account-button" href="/account">♙<small>ACCOUNT<br /><b>My Profile</b></small></Link>
        <Link className="cart-pill" href="/"><span>▣</span><span>CART<br /><b>৳0.00</b></span></Link>
      </header>
      <nav className="navline notifications-nav"><Link className="category-link" href="/">☷ &nbsp; Categories (See All)</Link>{["Home", "New Arrivals", "Sneakers", "Slides & Sandals", "Accessories", "Releases", "Stock Cleaness", "Upcoming"].map((item) => <Link href="/" key={item}>{item}</Link>)}<span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span></nav>
      <div className="notification-breadcrumb"><Link href="/">HOME</Link><span>›</span><Link href="/account">ACCOUNT</Link><span>›</span><b>NOTIFICATIONS &amp; ALERTS</b></div>
      <section className="notification-heading">
        <div><span className="radar-kicker"><i /> LIVE RADAR ACTIVE &nbsp; · &nbsp; Bangladesh Direct Drops</span><h1>Notifications &amp; Drop Radar</h1><p>Real-time release alarms, hub authentication checkpoints, VIP priority raffle allocations, and account perks.</p></div>
        <div className="notification-heading-actions"><button className="mark-read-button" onClick={markAllRead}><CheckCheck size={13} /> Mark all as read</button><button className="alert-preferences-button" onClick={() => document.getElementById("radar-channels")?.scrollIntoView({ behavior: "smooth" })}><Radio size={13} /> Alert Preferences</button></div>
      </section>
      <div className="notification-tabs">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "selected" : ""} onClick={() => setTab(item.id)}>{item.name} <span>{item.id === "all" ? alerts.length + 1 : item.id === "unread" ? unreadCount : item.count}</span>{item.id === "unread" && unreadCount > 0 && <i />}</button>)}</div>
      {notice && <div className="notification-notice" role="status">{notice}<button onClick={() => setNotice("")}>Dismiss</button></div>}
      <section className="notification-layout">
        <div className="alert-feed">{filteredAlerts.map((alert) =>
          <article className={`alert-card ${alert.unread ? "alert-unread" : ""}`} key={alert.id}>
            <div className={`alert-icon alert-icon-${alert.kind}`}><AlertIcon kind={alert.kind} />{alert.kind === "drop" && <small>DROP</small>}{alert.kind === "order" && <small>PASS</small>}{alert.kind === "price" && <small>-15%</small>}{alert.kind === "reward" && <small>VIP</small>}</div>
            <div className="alert-content">
              <div className="alert-meta"><span><b>{alert.label}</b> &nbsp;{alert.eyebrow}</span><small className={alert.unread ? "time-unread" : ""}>{alert.unread && <i />} {alert.time}</small></div>
              <h2>{alert.title}</h2><p>{alert.message}</p>
              {alert.product && <div className="alert-product"><img src={alert.product.image} alt={alert.product.name} /><div><small>{alert.product.category}</small><b>{alert.product.name}</b><span>{alert.product.price}{alert.product.previous && <del>{alert.product.previous}</del>}</span></div></div>}
              {typeof alert.progress === "number" && <div className="order-progress"><div><span>Authentication Complete (Step 3/4)</span><b>{alert.progress}%</b></div><span><i style={{ width: `${alert.progress}%` }} /></span></div>}
              {alert.actions && <div className="alert-actions">{alert.actions.map((label, index) => <button className={index === 0 && ["Join VIP Raffle", "Track Package", "Quick Add to Cart", "Set SMS Reminder", "View Member Passport"].includes(label) ? "primary-alert-action" : ""} key={label} onClick={() => action(label)}>{label === "Track Package" && <Truck size={12} />}{label === "Set SMS Reminder" && <Bell size={12} />}{label === "Join VIP Raffle" && <TicketPercent size={12} />}{label}</button>)}</div>}
            </div>
          </article>)}
          {filteredAlerts.length === 0 && <div className="no-alerts"><Bell size={22} /><b>You&apos;re all caught up</b><span>No notifications match this filter.</span></div>}
        </div>
        <aside className="radar-sidebar">
          <section className="radar-panel" id="radar-channels"><div className="radar-panel-heading"><h2><Radio size={14} /> Radar Channels</h2><span>INSTANT PUSH</span></div><p>Customize how drops, price crashes, and physical authentication updates reach your devices in Bangladesh.</p>
            {[{ name: "Instant WhatsApp Drop Pings", detail: "Direct ping 5 mins before sneaker queues launch." }, { name: "SMS Order Status Updates", detail: "Hub check-in, dispatch, & courier OTP notifications." }, { name: "Exclusive Flash Sale Alerts", detail: "Instant alerts when sizes in your wishlist drop ≥ 15%." }].map((preference, index) => <div className="radar-toggle-row" key={preference.name}><span><b>{preference.name}</b><small>{preference.detail}</small></span><button className={preferences[index] ? "toggle-on" : ""} aria-pressed={preferences[index]} aria-label={`Toggle ${preference.name}`} onClick={() => setPreferences((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}><i /></button></div>)}
            <div className="preferences-saved"><Check size={12} /> Preferences Auto-Saved</div>
          </section>
          <section className="priority-support"><Headset size={17} /><span>PRIORITY SUPPORT</span><h3>Have Questions on a Drop or Verification?</h3><p>Connect with our lead sneaker specialist at the Rajshahi verification hub. Available 24/7 for urgent delivery or drop inquiries.</p><small>HOTLINE NUMBER</small><a href="tel:01300714517">01300714517 <span>☎</span></a></section>
          <section className="hub-info"><b>♙ &nbsp; HUB PICKUPS &amp; CARE</b><p>All drop raffles are pick-up eligible with complimentary lace adjustments at our <strong>Rajshahi (Alakar More)</strong> and <strong>Bogura (Bogora)</strong> flagships.</p></section>
        </aside>
      </section>
      <footer className="catalog-footer" id="footer"><div className="footer-grid"><div><Link className="brand footer-brand" href="/">T-SHOE<span className="green-dot">•</span></Link><p>Bangladesh&apos;s premium authentic sneaker and urban streetwear marketplace. Sourcing genuine hype silhouettes, limited editions, luxury slides, and street essentials direct from global distributors.</p><div className="support-box"><small>CUSTOMER SUPPORT HOTLINE</small><b>☎ 01300714517</b><span>Available 10:00 AM–10:00 PM (Everyday)</span></div></div><div><h4>BRANCH OUTLETS</h4><b>◉ RAJSHAHI OUTLET</b><p>Holding 142, Level 2, Alakar More, Station Road, Rajshahi - 6000</p><b>◉ BOGURA OUTLET</b><p>Holding 42, Jaleshwaritola Main Road, Bogura Sadar, Bogura - 5800</p></div><div><h4>QUICK LINKS</h4><Link href="/">Home</Link><Link href="/">New Arrivals</Link><Link href="/">Sneakers Showcase</Link><Link href="/order-tracking">Order Tracking</Link><Link href="/">Authentication Protocol</Link></div><div><h4>SELLER ZONE</h4><a href="mailto:seller@t-shoe.com">Become a Seller</a><a href="mailto:seller@t-shoe.com">Seller Portal Login</a><a href="mailto:seller@t-shoe.com">Consignment Guidelines</a><Link href="/account">My Account</Link></div></div><div className="express-footer-bottom"><span>PAYMENT METHODS: &nbsp; ▪ bKash &nbsp; ▪ Nagad &nbsp; ▪ VISA &nbsp; ▪ Mastercard &nbsp; ▪ COD</span><span>© 2026 T-Shoe Bangladesh (t-shoe.com). All rights reserved.</span></div></footer>
    </main>
  );
}
