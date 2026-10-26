"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import { productsSeed, type Product } from "../../../lib/products";
import { collectionNavigation } from "../../../lib/navigation";

const collectionDetails: Record<string, { title: string; description: string; matches: RegExp }> = {
  "new-arrivals": {
    title: "New Arrivals",
    description: "Freshly sourced sneakers, checked and ready for their next home.",
    matches: /new|arrival|just in/i,
  },
  sneakers: {
    title: "Sneakers",
    description: "Explore authentic sneakers and streetwear essentials from trusted brands.",
    matches: /./,
  },
  "slides-sandals": {
    title: "Slides & Sandals",
    description: "Browse comfortable slides and sandals for everyday wear.",
    matches: /slides?|sandals?/i,
  },
  accessories: {
    title: "Accessories",
    description: "Shop the finishing touches for your footwear rotation.",
    matches: /accessor|cleaner|care|sock|lace/i,
  },
  releases: {
    title: "Releases",
    description: "Discover limited drops, collaborations, and sought-after releases.",
    matches: /rare|limited|collab|hype|retro|release/i,
  },
  "stock-cleaness": {
    title: "Stock Cleaness",
    description: "Find special prices on selected pairs while sizes last.",
    matches: /cleaness|sale|off|clearance/i,
  },
  upcoming: {
    title: "Upcoming",
    description: "See what is coming next to the T-SHOE collection.",
    matches: /upcoming|pre.?order|coming soon/i,
  },
};

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;
  return typeof product.id === "number"
    && typeof product.name === "string"
    && typeof product.category === "string"
    && typeof product.price === "number"
    && typeof product.image === "string";
}

function productMatches(product: Product, matcher: RegExp, slug: string) {
  if (slug === "sneakers") return true;
  if (slug === "new-arrivals" && product.id >= 12) return true;
  return matcher.test(`${product.name} ${product.category} ${product.label ?? ""}`);
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collectionDetails[params.slug];
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        if (!response.ok) throw new Error(`Product service returned ${response.status}.`);
        return response.json();
      })
      .then((data: unknown) => {
        if (!Array.isArray(data) || !data.every(isProduct)) {
          throw new Error("Product service returned an invalid product list.");
        }
        if (active) setProducts(data);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Unable to load products.");
      });
    return () => { active = false; };
  }, []);

  const visibleProducts = useMemo(
    () => collection ? products.filter((product) => productMatches(product, collection.matches, params.slug)) : [],
    [collection, params.slug, products],
  );

  if (!collection) {
    return <main className="collection-page"><section className="collection-empty"><h1>Collection not found</h1><Link href="/">Return home</Link></section></main>;
  }

  return (
    <main className="collection-page">
      <div className="topline"><span>☎ HELPLINE: 01747295464</span><span>BANGLADESH EXPRESS DELIVERY</span></div>
      <header className="main-header">
        <div className="header-brand-group"><Link className="brand" href="/">T-SHOE<span className="green-dot">•</span></Link></div>
        <label className="searchbox"><Search size={15} /><input aria-label="Search products" placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /></label>
        <div className="header-actions"><Link className="header-icon account-button" href="/account" aria-label="My account"><UserRound size={23} /><small>ACCOUNT<br /><b>My Profile</b></small></Link>
          <Link className="cart-pill" href="/checkout"><ShoppingBag size={16} /><span>CART<br /><b>৳0.00</b></span></Link></div>
      </header>
      <nav className="navline collection-nav">
        <Link className="category-link" href="/brands">☷ &nbsp; Categories (See All)</Link>
        {collectionNavigation.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}
        <span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span>
      </nav>
      <section className="collection-heading">
        <div><Link href="/">HOME</Link><span>›</span><b>{collection.title.toUpperCase()}</b></div>
        <span className="collection-kicker"><ShieldCheck size={13} /> VERIFIED AUTHENTIC COLLECTION</span>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </section>
      <section className="collection-results">
        <div className="collection-results-heading"><h2>{collection.title}</h2><span>{visibleProducts.length} products</span></div>
        {loadError && <p className="collection-error" role="status">Showing saved catalogue items; live inventory could not be refreshed.</p>}
        {visibleProducts.length ? <div className="collection-product-grid">
          {visibleProducts.map((product) => <Link className="collection-product" href={`/product/${product.id}`} key={product.id}>
            <div><img src={product.image} alt={product.name} />{product.label && <span>{product.label}</span>}</div>
            <small>{product.category}</small><h3>{product.name}</h3><b>৳{product.price.toLocaleString("en-US")}</b><span className="collection-product-link">VIEW PRODUCT <ArrowRight size={12} /></span>
          </Link>)}
        </div> : <div className="collection-empty"><h2>No products in this collection yet</h2><p>We are updating this collection. Explore our other verified products in the meantime.</p><Link href="/collections/sneakers">Browse sneakers <ArrowRight size={13} /></Link></div>}
      </section>
    </main>
  );
}
