"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { collectionNavigation } from "../../lib/navigation";
import { ArrowUpRight, Search, ShieldCheck, Store, Tag } from "lucide-react";

const collections = [
  { name: "Nike", mark: "✓", children: 6, tags: ["AF1", "Dunk", "Vomero"], type: "Streetwear Icons", featured: "TOP BRAND" },
  { name: "Adidas", mark: "///", children: 4, tags: ["Samba", "Campus", "Originals"], type: "Performance & Running" },
  { name: "Jordan", mark: "J", children: 9, tags: ["Retro AJ1", "AJ4", "Low"], type: "Streetwear Icons", featured: "HYPE" },
  { name: "New Balance", mark: "NB", children: 3, tags: ["1906R", "9060", "550"], type: "Streetwear Icons" },
  { name: "Converse", mark: "CONVERSE ☆", children: 0, tags: [], type: "Streetwear Icons", tagline: "Chuck 70 & All-Star" },
  { name: "Puma", mark: "PUMA", children: 0, tags: [], type: "Performance & Running", tagline: "Suede & Palermo" },
  { name: "Asics", mark: "asics", children: 0, tags: [], type: "Performance & Running", tagline: "Gel-Kayano 14 & NYC" },
  { name: "Reebok", mark: "Reebok", children: 0, tags: [], type: "Streetwear Icons", tagline: "Club C 85 Vintage" },
  { name: "Louis Vuitton", mark: "LV", children: 0, tags: [], type: "Luxury & Editions", featured: "LUXE", tagline: "LV Trainer & Collabs" },
  { name: "Vans", mark: "VANS", children: 0, tags: [], type: "Streetwear Icons", tagline: "Old Skool & Knu Skool" },
  { name: "Sneakers", mark: "T-SHOE", children: 0, tags: [], type: "All Collections", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80", tagline: "View All Silhouettes" },
  { name: "Slides & Sandals", mark: "SLIDES", children: 0, tags: [], type: "All Collections", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=400&q=80", tagline: "Yeezy Slide, Calm, Adilette" },
  { name: "Stock Cleaness", mark: "♨ SALE", children: 0, tags: [], type: "Clearance & Editions", featured: "UP TO 50% OFF", tagline: "Limited Deadstock Pairs" },
  { name: "7A Grade", mark: "7A", children: 0, tags: [], type: "Clearance & Editions", tagline: "Tier One Certified" },
  { name: "New Arrivals", mark: "NEW", children: 0, tags: [], type: "All Collections", featured: "JUST IN", tagline: "This Week's Sourced Pairs" },
  { name: "Accessories", mark: "♙", children: 0, tags: [], type: "All Collections", tagline: "Foam Cleaners, Crease Guards" },
  { name: "On Cloud", mark: "O n", children: 0, tags: [], type: "Performance & Running", tagline: "Cloudmonster, Cloudtilt" },
  { name: "Upcoming", mark: "↗", children: 0, tags: [], type: "All Collections", featured: "CALENDAR", tagline: "Pre-Order Drops BD" },
  { name: "Hoka One One", mark: "HOKA ONE ONE", children: 0, tags: [], type: "Performance & Running", tagline: "Clifton 9 & Bondi 8" },
];
const filters = ["All Collections", "Performance & Running", "Streetwear Icons", "Clearance & Editions", "Luxury & Editions"];

export default function BrandDirectoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Collections");
  const visible = useMemo(() => collections.filter((brand) =>
    (filter === "All Collections" || brand.type === filter) &&
    `${brand.name} ${brand.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);

  return (
    <main className="brand-directory-page">
      <div className="topline"><span>☎ HELPLINE: 01747295464</span><span>▣ Bangladesh Express Delivery</span><Link href="/account">Become a Seller</Link><Link href="/account">Login to Seller</Link></div>
      <header className="main-header"><div className="header-brand-group"><Link className="brand" href="/"><span>T-SHOE<span className="green-dot">•</span></span><small>EST. BD</small></Link></div><label className="searchbox"><Search size={15} /><input placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">SEARCH</button></label><div className="header-actions"><Link className="header-icon" href="/notifications">♡</Link><Link className="header-icon account-button" href="/account">♙<small>ACCOUNT<br /><b>My Profile</b></small></Link><Link className="cart-pill" href="/checkout">▣<span>CART<br /><b>৳0.00</b></span></Link></div></header>
      <nav className="navline brand-directory-nav"><Link className="category-link" href="/brands">☷ &nbsp; Categories (See All)</Link>{collectionNavigation.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}<span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span></nav>
      <div className="directory-topline"><span>HOME &nbsp;›&nbsp; BRAND DIRECTORY &amp; CATEGORIES</span><div><b>◉ 100% LEGIT VERIFIED SOURCING</b><i>·</i><span>▣ DHAKA &amp; NATIONWIDE 24–48H DELIVERY</span><i>·</i><span>♙ RAJSHAHI &amp; BOGURA HUBS</span></div></div>
      <section className="directory-intro"><div><span className="directory-kicker">◉ GLOBAL SNEAKER AUTHORITY BD</span><h1>All Footwear Brands &amp; Silhouettes</h1><p>Explore 19+ authentic sportswear houses, certified hype releases, slides, and precision athletic labels. Verified through T-SHOE&apos;s multi-stage deadstock authenticity standard.</p></div><div className="directory-stats"><span><b>{visible.length.toString().padStart(2, "0")}</b><small>ACTIVE HUBS<br />Brands &amp; Curations</small></span><span><ShieldCheck /><small>GRADE<br /><b>100% Genuine</b></small></span></div></section>
      <section className="directory-controls"><label><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search category or brand name (e.g., Nike, Jordan, Asics, Slides, Cleaness)" /></label>{filters.map((option) => <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}{option === "All Collections" ? ` (${collections.length})` : ""}</button>)}</section>
      <section className="brand-tile-grid">{visible.map((brand) => <Link className={`brand-tile ${brand.featured === "UP TO 50% OFF" ? "clearance-tile" : ""}`} key={brand.name} href={collectionNavigation.find((item) => item.label === brand.name)?.href ?? `/?brand=${encodeURIComponent(brand.name)}`}>
        {brand.featured && <span className="brand-tile-featured">{brand.featured}</span>}
        <div className={`brand-mark ${brand.image ? "brand-mark-image" : ""}`}>{brand.image ? <img src={brand.image} alt="" /> : <b>{brand.mark}</b>}</div>
        <h2>{brand.name}</h2><small>{brand.children} CHILD CATEGORIES</small>
        {brand.tags.length > 0 ? <div className="brand-tags">{brand.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : <span className="brand-tagline">{brand.tagline} <ArrowUpRight size={10} /></span>}
      </Link>)}</section>
      <section className="directory-promos"><article className="clearance-promo"><span><Tag size={11} /> LIMITED STOCK CLEANESS</span><h2>Last Sizes &amp; Deadstock Clearance Deals</h2><p>Score rare authentic kicks at up to 50% off retail. Direct from certified European &amp; Japanese retailers, boxed and inspected.</p><Link href="/?brand=Stock%20Cleaness">Shop Clearance Stock <ArrowUpRight size={12} /></Link></article><article className="fitting-promo"><span><Store size={11} /> IN-PERSON TRY ON</span><h2>Visit Our Flagship Fitting Hubs</h2><p>Unsure about sizing in Jordan vs. Asics? Visit our retail experience hubs in Rajshahi (Alakar Mor) or Bogura (Jaleshwaritola) for legit checks and on-foot fittings.</p><div><a href="tel:01747295464">☎ Rajshahi: 01747295464</a><a href="tel:01747295464">☎ Bogura: 01747295464</a></div></article></section>
      <footer className="catalog-footer"><div className="footer-grid"><div><Link className="brand footer-brand" href="/">T-SHOE<span className="green-dot">•</span></Link><p>Bangladesh&apos;s premium authentic sneaker marketplace. Genuine hype silhouettes, limited editions, and street essentials.</p></div><div><h4>BRANCH OUTLETS</h4><p>Rajshahi · Alakar Mor<br />Bogura · Jaleshwaritola</p></div><div><h4>QUICK NAVIGATION</h4><Link href="/">Home</Link><Link href="/order-tracking">Order Tracking</Link><Link href="/notifications">Drop Alerts</Link></div><div><h4>ACCOUNT</h4><Link href="/account">My Account</Link><Link href="/orders">Order History</Link></div></div><div className="copyright">© 2026 T-SHOE. All rights reserved.</div></footer>
    </main>
  );
}
