"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collectionNavigation } from "../../../lib/navigation";
import { useParams, useRouter } from "next/navigation";
import { Check, Heart, MapPin, PackageCheck, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
import { apiRequest } from "../../../lib/auth";
import { productsSeed } from "../../../lib/products";

type Product = { id: number; name: string; category: string; price: number; image: string; description: string; label?: string };
type CartItem = { product: Product; qty: number; size: string };
const money = (amount: number) => "৳" + amount.toLocaleString("en-US");

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [size, setSize] = useState("42");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Story & Specifications");
  const [notice, setNotice] = useState("");
  const [wishlist, setWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    apiRequest<Product[]>("/products/")
      .then((data) => {
        const match = data.find((item) => String(item.id) === params.id) ?? productsSeed.find((item) => String(item.id) === params.id);
        if (!match) throw new Error("This product could not be found.");
        if (!cancelled) {
          setProduct(match);
          const recommendations = data.length ? data : productsSeed;
          setRelatedProducts(recommendations.filter((item) => item.id !== match.id).slice(0, 3));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const fallback = productsSeed.find((item) => String(item.id) === params.id);
          if (fallback) {
            setProduct(fallback);
            setRelatedProducts(productsSeed.filter((item) => item.id !== fallback.id).slice(0, 3));
          } else {
            setProduct(null);
            setLoadError(error instanceof Error ? error.message : "Unable to load this product.");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    try {
      const saved = JSON.parse(localStorage.getItem("tshoe-wishlist") || "[]") as number[];
      setWishlist(saved.includes(Number(params.id)));
    } catch {
      localStorage.removeItem("tshoe-wishlist");
    }
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const saveWishlist = () => {
    if (!product) return;
    let saved: number[] = [];
    try {
      saved = JSON.parse(localStorage.getItem("tshoe-wishlist") || "[]");
    } catch {
      localStorage.removeItem("tshoe-wishlist");
    }
    const next = saved.includes(product.id) ? saved.filter((id) => id !== product.id) : [...saved, product.id];
    localStorage.setItem("tshoe-wishlist", JSON.stringify(next));
    setWishlist(next.includes(product.id));
  };

  const addToCart = () => {
    if (!product) return;
    try {
      const cart = JSON.parse(localStorage.getItem("tshoe-cart") || "[]") as CartItem[];
      const existing = cart.find((item) => item.product.id === product.id && item.size === size);
      const next = existing
        ? cart.map((item) => item === existing ? { ...item, qty: item.qty + quantity } : item)
        : [...cart, { product, qty: quantity, size }];
      localStorage.setItem("tshoe-cart", JSON.stringify(next));
      setNotice(`${product.name} (EU ${size}) added to your bag.`);
    } catch {
      setNotice("Could not update your shopping bag. Please try again.");
    }
  };

  if (!product) {
    return <main className="product-detail-page"><header className="main-header"><div className="header-brand-group"><Link className="brand" href="/">T-SHOE<span className="green-dot">•</span></Link></div></header><section className="product-load-state" role={loading ? "status" : "alert"}><h1>{loading ? "Loading product…" : "Product unavailable"}</h1><p>{loading ? "Please wait while we load the product details." : loadError}</p><Link href="/">Return to the sneaker collection</Link></section></main>;
  }

  return (
    <main className="product-detail-page">
      <div className="topline"><span>☎ HELPLINE: 01747295464</span><span>Bangladesh Express Delivery</span><Link href="/account">Become a Seller</Link><Link href="/account">Login to Seller</Link></div>
      <header className="main-header"><div className="header-brand-group"><Link className="brand" href="/"><span>T-SHOE<span className="green-dot">•</span></span><small>EST. BD</small></Link></div><label className="searchbox"><span>⌕</span><input placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">SEARCH</button></label><div className="header-actions"><Link className="header-icon" href="/notifications">♡</Link><Link className="header-icon account-button" href="/account">♙<small>ACCOUNT<br /><b>My Profile</b></small></Link><Link className="cart-pill" href="/checkout"><ShoppingBag size={15} /><span>CART<br /><b>৳0.00</b></span></Link></div></header>
      <nav className="navline product-detail-nav"><Link className="category-link" href="/brands">☷ &nbsp; Categories (See All)</Link>{collectionNavigation.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}<span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span></nav>
      <div className="product-assurance-strip"><span>◉ &nbsp;HIGH DEMAND ITEM · VERIFIED AUTHENTIC STOCK CURRENTLY IN HUBS</span><span>▣ EXPRESS NEXT-DAY: DHAKA, RAJSHAHI, BOGURA</span><span>✓ 100% GENUINE BOX &amp; TAG GUARANTEE</span></div>
      <div className="product-breadcrumb"><Link href="/">HOME</Link> &nbsp;›&nbsp; <Link href="/brands">SNEAKERS</Link> &nbsp;›&nbsp; <b>{product.category.toUpperCase()} / {product.name.toUpperCase()}</b></div>
      <section className="product-detail-layout">
        <div className="product-gallery">
          <div className="product-main-image"><span className="detail-badges"><b>-20% DEADSTOCK</b><b>✓ {product.label || "VERIFIED LEGIT"}</b></span><button className="product-detail-wish" onClick={saveWishlist} aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}><Heart fill={wishlist ? "currentColor" : "none"} size={17} /></button><span className="detail-image-watermark">T-SHOE</span><img src={product.image} alt={product.name} /><button className="studio-view" onClick={() => setNotice("360° studio view is not available for this item yet.")}>◉ &nbsp; 360° STUDIO SPIN IN-HAND VIEW</button></div>
          <div className="product-thumbnails">{[product.image, "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=400&q=85", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=85", "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=85"].map((image, index) => <button key={`${image}-${index}`}><span>T-SHOE</span><img src={image} alt={`${product.name} view ${index + 1}`} /></button>)}</div>
          <div className="product-auth-check"><ShieldCheck /><span><b>PHYSICAL DOUBLE BOX &amp; RFID INSPECTED</b><small>Each pair is verified by our footwear specialists prior to hub dispatch.</small></span><strong>✓ 100% PASS</strong></div>
        </div>
        <div className="product-purchase-panel">
          <div className="product-category-tag">{product.category.toUpperCase()} · SKU #TS-{product.id.toString().padStart(5, "0")}</div><span className="product-viewers">◉ &nbsp;12 PEOPLE VIEWING</span>
          <h1>{product.name}</h1><div className="product-rating-line"><b>★ 5.0</b><a href="#product-tabs">38 Verified Owner Reviews</a><span>142 Pairs Delivered in BD</span></div>
          <div className="product-drop-price"><div><small>INSTANT DROP PRICE</small><b>{money(product.price)}</b><del>{money(Math.round(product.price * 1.25))}</del></div><span>SAVE {money(Math.round(product.price * .2))} (-20%)<small>Vat &amp; Booking Included</small></span></div>
          <div className="store-availability"><div><b>♙ &nbsp;STORE LOCATION AVAILABILITY</b><span>LIVE INVENTORY</span></div><div><span><i /> Rajshahi Outlet<small>Alakar Mor, Ghoramara</small><b>4 Pairs Left</b></span><span><i /> Bogura Outlet<small>Jaleshwaritola Main Rd.</small><b>2 Pairs Left</b></span></div></div>
          <div className="size-selector-heading"><b>SELECT SIZE (EU)</b><span>Selected: EU {size} (US 8.5)</span><Link href="/brands">SIZE GUIDE</Link></div>
          <div className="product-size-list">{["39", "40", "41", "42", "42.5", "43", "44", "45"].map((option) => <button key={option} className={size === option ? "selected" : ""} onClick={() => setSize(option)}>{option}</button>)}</div>
          <small className="fit-note">✓ Fits True To Size (TTS). Order standard Nike/Jordan size.</small>
          <div className="product-buy-actions"><div className="product-quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity((value) => Math.min(10, value + 1))}><Plus size={12} /></button></div><button className="add-product-button" onClick={addToCart}><ShoppingBag size={13} /> ADD TO CART · {money(product.price * quantity)}</button></div>
          <button className="instant-buy-button" onClick={() => { addToCart(); router.push("/checkout"); }}><Zap size={13} /> INSTANT BUY WITH CASH ON DELIVERY / BKASH</button>
          {notice && <p className="product-notice" role="status">{notice}</p>}
          <div className="product-guarantees"><span><ShieldCheck /><b>100% GENUINE BOX &amp; SHOES</b><small>Triple-checked deadstock pairs only.</small></span><span><RotateCcw /><b>7 DAYS SIZE REPLACEMENT</b><small>Hassle-free size swap warranty.</small></span><span><Truck /><b>EXPRESS COURIER DISPATCH</b><small>24–48 hrs anywhere in BD.</small></span><span><PackageCheck /><b>BKASH &amp; HAND DELIVERY</b><small>Inspect pair before balance payment.</small></span></div>
        </div>
      </section>
      <section className="frequently-bought"><div><span>ESSENTIAL PAIRINGS</span><h2>Frequently Bought Together</h2><p>Protect your premium nubuck and maintain sole longevity with authentic care essentials.</p></div><div className="bundle-row"><article><img src={product.image} alt="" /><span><small>THIS ITEM</small><b>{product.name}</b><strong>{money(product.price)}</strong></span></article><b>+</b><article><img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=300&q=80" alt="Sneaker care accessory" /><span><small>PROTECTION</small><b>Sneaker Crease Shields (Pair)</b><strong>৳350</strong></span></article><b>+</b><article><img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=300&q=80" alt="Shoe care kit" /><span><small>CARE KIT</small><b>Deep Clean Foam Kit</b><strong>৳650</strong></span></article><button onClick={addToCart}>ADD ALL 3 TO CART</button></div></section>
      <section className="product-information" id="product-tabs"><div className="product-tabs">{["Story & Specifications", "In-Store Try-On & Fit", "Customer Reviews (38)", "Delivery & Outlets"].map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>{activeTab === "Story & Specifications" ? <div className="product-story"><div><small>THE SILHOUETTE</small><h2>Reverse Aesthetic. Heritage Craft.</h2><p>{product.description} Every pair is sourced from verified distributors, inspected for material quality, stitch symmetry, and correct box-label details before dispatch.</p><div className="story-spec-chips"><span>✓ Nubuck &amp; Leather<small>Premium materials and natural texture.</small></span><span>✓ Triple Lace Set<small>Includes original laces and finishing details.</small></span></div></div><div className="spec-table"><b>VERIFIED PRODUCT SPECIFICATIONS</b><span>Manufacturer SKU <strong>TS-{product.id.toString().padStart(5, "0")}</strong></span><span>Colorway <strong>Authentic color selection</strong></span><span>Upper Construction <strong>Verified premium materials</strong></span><span>Midsole <strong>Comfort-cushioned</strong></span><span>Box Status <strong>Original double-boxed</strong></span><span>Newke Quality Tier <strong>TIER 1 AUTHENTIC</strong></span></div></div> : <div className="product-tab-copy"><MapPin size={18} /><p>{activeTab === "In-Store Try-On & Fit" ? "Try your selected size at our Rajshahi Alakar Mor or Bogura Jaleshwaritola outlet before purchase." : activeTab === "Customer Reviews (38)" ? "Verified owner reviews will appear here as customers share feedback on their orders." : "Express courier delivery across Bangladesh. Contact support for outlet pickup and exchange details."}</p></div>}</section>
      {relatedProducts.length > 0 && <section className="related-products"><span>DISCOVER MORE DROPS</span><h2>You Might Also Covet</h2><div>{relatedProducts.map((item) => <Link href={`/product/${item.id}`} key={item.id}><img src={item.image} alt={item.name} /><b>{item.name}</b><strong>{money(item.price)}</strong></Link>)}</div></section>}
      <footer className="catalog-footer"><div className="footer-grid"><div><Link className="brand footer-brand" href="/">T-SHOE<span className="green-dot">•</span></Link><p>Bangladesh&apos;s authentic sneaker and streetwear marketplace.</p></div><div><h4>BRANCH OUTLETS</h4><p>Rajshahi · Alakar Mor<br />Bogura · Jaleshwaritola</p></div><div><h4>QUICK LINKS</h4><Link href="/brands">Shop All Brands</Link><Link href="/orders">Order Tracking</Link><Link href="/notifications">Drop Alerts</Link></div><div><h4>ACCOUNT</h4><Link href="/account">My Account</Link><Link href="/orders">Order History</Link></div></div><div className="copyright">© 2026 T-SHOE. All rights reserved.</div></footer>
    </main>
  );
}
