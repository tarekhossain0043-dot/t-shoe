"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collectionNavigation } from "../lib/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  Heart,
  Menu,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  UserRound,
  MessageCircle,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  label?: string;
  description: string;
};
type CartItem = { product: Product; qty: number; size: string };

const productsSeed: Product[] = [
  {
    id: 1,
    name: "Travis Scott x AJ1 Low Reverse Mocha",
    category: "Jordan / Cactus Jack",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85",
    label: "RARE DROP",
    description:
      "A collector favorite with premium materials and a distinctive reverse Swoosh.",
  },
  {
    id: 2,
    name: "Nike Air AlphaFly 3 Proto",
    category: "Nike Running",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85",
    label: "PRO RACE",
    description:
      "Responsive cushioning and a lightweight build for your fastest runs.",
  },
  {
    id: 3,
    name: "Adizero Prime X3 Strong",
    category: "Adidas Athletics",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85",
    label: "50MM STACK",
    description:
      "High energy return and a bold profile built for long-distance training.",
  },
  {
    id: 4,
    name: "Air Jordan 4 Retro White Cement",
    category: "Jordan Retro",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85",
    label: "LEGEND RETRO",
    description: "A timeless retro silhouette, hand-checked for authenticity.",
  },
  {
    id: 5,
    name: "Air Jordan 1 Low Fragment Blue",
    category: "Jordan / Fragment",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85",
    label: "HYPE GRAIL",
    description:
      "Classic court design with crisp blue accents and a premium finish.",
  },
  {
    id: 6,
    name: "New Balance 9060 Black Grey",
    category: "New Balance",
    price: 1900,
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=85",
    label: "TRENDING Y2K",
    description: "Chunky retro running style with modern all-day comfort.",
  },
  {
    id: 7,
    name: "Nike Air Force 1 Low 'Venom'",
    category: "Nike Sportswear",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85",
    label: "-24% OFF",
    description: "Black-on-black style with everyday versatility.",
  },
  {
    id: 8,
    name: "Cloudboom Max Flurry Blue",
    category: "On Running",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=85",
    label: "SWISS TECH",
    description: "Lightweight engineered performance for race day.",
  },
  {
    id: 9,
    name: "Asics Novablast 5 Indigo",
    category: "Asics Running",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    label: "BOUNCY RIDE",
    description: "Responsive cushioning makes every daily run feel effortless.",
  },
  {
    id: 10,
    name: "Air Jordan 1 Mid Mystic Green",
    category: "Jordan",
    price: 1400,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85",
    label: "POPULAR",
    description: "A fresh green colorway in a familiar streetwear shape.",
  },
  {
    id: 11,
    name: "AF1 Low x The North Face",
    category: "Nike x TNF",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85",
    label: "COLLAB",
    description:
      "An everyday classic reworked with outdoors-inspired detailing.",
  },
  {
    id: 12,
    name: "Adizero Evo SL Lightstrike",
    category: "Adidas Performance",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85",
    label: "NEW ARRIVAL",
    description: "A featherlight daily trainer with energetic cushioning.",
  },
  {
    id: 13,
    name: "Nike Air Max 97 Platinum",
    category: "Nike Running",
    price: 2900,
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85",
    label: "CLASSIC",
    description: "A streamlined icon with cushioned comfort.",
  },
  {
    id: 14,
    name: "New Balance 990v6 Grey",
    category: "New Balance",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=85",
    label: "MADE TO MOVE",
    description: "Premium materials meet dependable everyday cushioning.",
  },
  {
    id: 15,
    name: "Asics Gel-Kayano 30",
    category: "Asics Running",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    label: "STABILITY",
    description: "Comfortable support for daily miles and long sessions.",
  },
  {
    id: 16,
    name: "Jordan Retro High OG",
    category: "Jordan Retro",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85",
    label: "LIMITED",
    description: "A high-top classic with iconic court-inspired details.",
  },
  {
    id: 17,
    name: "Puma Deviate Nitro Elite",
    category: "Puma Running",
    price: 2600,
    image:
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=85",
    label: "RACE READY",
    description: "A smooth, energetic ride for training and race day.",
  },
];

const brands = [
  "Nike",
  "Adidas",
  "Air Jordan",
  "New Balance",
  "Asics",
  "On Running",
];
const money = (amount: number) => "৳" + amount.toLocaleString("en-US");

function ProductCard({
  product,
  onAdd,
  onOpen,
  wished,
  onWish,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
  wished: boolean;
  onWish: (id: number) => void;
}) {
  return (
    <article className="catalog-card">
      <div
        className="catalog-photo"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(product)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(product);
          }
        }}
        aria-label={`View ${product.name}`}
      >
        <span className="catalog-badge">{product.label}</span>
        <img src={product.image} alt={product.name} />
        <span className="catalog-image-watermark" aria-hidden="true">
          T-SHOE
        </span>
        <button
          className="catalog-wish"
          onClick={(event) => {
            event.stopPropagation();
            onWish(product.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={15} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="catalog-card-copy">
        <div className="catalog-card-meta">
          <small>{product.category.toUpperCase()}</small>
          <span>
            ★ 5.0 <i>(34)</i>
          </span>
        </div>
        <Link className="catalog-product-name" href={`/product/${product.id}`}>
          {product.name}
        </Link>
        <p className="catalog-price">
          {money(product.price)}{" "}
          <del>{money(Math.round(product.price * 1.16))}</del>
        </p>
        <div className="catalog-card-actions">
          <button onClick={() => onAdd(product)}>
            <ShoppingCart size={13} /> ADD TO CART
          </button>
          <Link
            className="catalog-quick"
            aria-label={`View ${product.name}`}
            href={`/product/${product.id}`}
          >
            <Search size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Brands");
  const [checkedBrands, setCheckedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(12500);
  const [sort, setSort] = useState("Featured Drops");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wish, setWish] = useState<number[]>([]);
  const [active, setActive] = useState<Product | null>(null);
  const [size, setSize] = useState("42");
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tshoe-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      localStorage.removeItem("tshoe-cart");
    }
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length) setProducts(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem("tshoe-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    setPage(1);
  }, [query, category, checkedBrands, maxPrice, sort, pageSize]);
  useEffect(() => {
    const requestedBrand = new URLSearchParams(window.location.search).get(
      "brand",
    );
    if (!requestedBrand) return;
    if (brands.includes(requestedBrand)) {
      setCategory(requestedBrand);
      return;
    }
    if (requestedBrand !== "Sneakers") setQuery(requestedBrand);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2300);
  };
  const matchesBrand = (product: Product, brand: string) => {
    const name = `${product.name} ${product.category}`.toLowerCase();
    if (brand === "Air Jordan")
      return name.includes("jordan") || name.includes("aj");
    if (brand === "On Running")
      return name.includes("on running") || name.includes("cloud");
    return name.includes(brand.toLowerCase());
  };
  const shown = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesQuickBrand =
        category === "All Brands" || matchesBrand(product, category);
      const matchesSelectedBrands =
        checkedBrands.length === 0 ||
        checkedBrands.some((brand) => matchesBrand(product, brand));
      return (
        matchesSearch &&
        matchesQuickBrand &&
        matchesSelectedBrands &&
        product.price <= maxPrice
      );
    });
    if (sort === "Price: Low to High")
      return filtered.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low")
      return filtered.sort((a, b) => b.price - a.price);
    if (sort === "Newest Arrivals") return filtered.sort((a, b) => b.id - a.id);
    return filtered;
  }, [products, query, category, checkedBrands, maxPrice, sort]);
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const pageProducts = shown.slice((page - 1) * pageSize, page * pageSize);
  const pageNumbers: (number | null)[] =
    pageCount <= 5
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : page <= 3
        ? [1, 2, 3, null, pageCount]
        : page >= pageCount - 2
          ? [1, null, pageCount - 2, pageCount - 1, pageCount]
          : [1, null, page - 1, page, page + 1, null, pageCount];

  const add = (product: Product, selectedSize = size) => {
    setCart((old) => {
      const found = old.find(
        (item) => item.product.id === product.id && item.size === selectedSize,
      );
      return found
        ? old.map((item) =>
            item === found ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...old, { product, qty: 1, size: selectedSize }];
    });
    setActive(null);
    notify("Added to your bag");
  };
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );
  const updateQuantity = (id: number, selectedSize: string, delta: number) =>
    setCart((old) =>
      old.map((item) =>
        item.product.id === id && item.size === selectedSize
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  const toggleBrand = (brand: string) =>
    setCheckedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand],
    );

  return (
    <main className="catalog-page">
      <div className="topline">
        <span>☎ HELPLINE: 01747295464</span>
        <span>BANGLADESH EXPRESS DELIVERY</span>
        <a href="#footer">▣ BECOME A SELLER</a>
        <a href="#footer">♙ LOGIN TO SELLER</a>
      </div>
      <header className="main-header">
        <div className="header-brand-group">
          <button
            className="mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
          >
            <Menu />
          </button>
          <Link className="brand" href="/">
            <span>
              T-SHOE<span className="green-dot">•</span>
            </span>
            <small>EST. BD</small>
          </Link>
        </div>
        <label className="searchbox">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search exclusive sneakers, slides, authentic drops, brands..."
          />
          <button type="button">SEARCH</button>
        </label>
        <div className="header-actions">
          <button
            className="header-icon"
            onClick={() => notify(`${wish.length} saved item(s)`)}
            aria-label="Wishlist"
          >
            <Heart size={19} />
            <sup>{wish.length}</sup>
          </button>
          <a
            className="header-icon notification-link"
            href="/notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <sup>3</sup>
          </a>
          <a className="header-icon account-button" href="/account">
            <UserRound size={18} />
            <small>
              ACCOUNT
              <br />
              <b>My Profile</b>
            </small>
          </a>
          <button className="cart-pill" onClick={() => setDrawer(true)}>
            <ShoppingCart size={16} />
            <span>
              CART
              <br />
              <b>{money(total)}</b>
            </span>
            <sup>{count}</sup>
          </button>
        </div>
      </header>
      <nav className={`navline ${menu ? "nav-open" : ""}`}>
        <Link className="category-link" href="/brands">
          <SlidersHorizontal size={14} /> Categories (See All)
        </Link>
        {collectionNavigation.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
        <span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span>
      </nav>

      <section className="home-showcase">
        <aside className="home-brand-rail">
          <div>
            <b>TOP FOOTWEAR BRANDS</b>
            <Link href="/brands">
              Browse all <ArrowRight size={11} />
            </Link>
          </div>
          {[
            ["Nike", "64+"],
            ["Adidas", "48+"],
            ["Jordan", "HOT"],
            ["New Balance", "32+"],
            ["Converse", "18+"],
            ["Puma", "15+"],
            ["Asics", "12+"],
            ["Reebok", "9+"],
            ["Louis Vuitton", "LUXE"],
            ["Vans", "24+"],
          ].map(([brand, count]) => (
            <Link
              key={brand}
              href={`/brands?brand=${encodeURIComponent(brand)}`}
            >
              <span>◉ &nbsp;{brand}</span>
              <small>{count}</small>
            </Link>
          ))}
        </aside>
        <div className="home-showcase-main">
          <div className="home-hero">
            <div className="home-hero-copy">
              <span>◉ SNEAKERS · STREETWEAR · SNEAKER CULTURE</span>
              <h1>
                Find Your
                <br />
                Next Classic.
              </h1>
              <p>
                100% verified original sneakers, athletic trainers, and
                streetwear grails delivered across Bangladesh.
              </p>
              <div>
                <Link href="#catalog">
                  SHOP LATEST DROPS <ArrowRight size={13} />
                </Link>
                <Link className="home-hero-secondary" href="/brands">
                  BRANDS &amp; COLLECTIONS
                </Link>
              </div>
            </div>
            <span className="home-hero-wordmark">T-SHOE</span>
            <div className="home-hero-feature">
              <img src={products[0]?.image || productsSeed[0].image} alt="" />
              <span>
                FEATURED DROP
                <br />
                <b>{products[0]?.name || productsSeed[0].name}</b>
                <Link href="/product/1">
                  VIEW PRODUCT <ArrowRight size={10} />
                </Link>
              </span>
            </div>
          </div>
          <div className="home-trust-row">
            <span>
              <BadgeCheck />
              <b>100% AUTHENTIC</b>
              <small>Verified by specialists</small>
            </span>
            <span>
              <Truck />
              <b>FAST DISPATCH</b>
              <small>24–48h across BD</small>
            </span>
            <span>
              <ShieldCheck />
              <b>EASY EXCHANGE</b>
              <small>7-day fit guarantee</small>
            </span>
            <span>
              <MapPin />
              <b>FLAGSHIP STORES</b>
              <small>Rajshahi &amp; Bogura</small>
            </span>
          </div>
          <div className="home-quick-links">
            <b>CURATED HUBS:</b>
            {[
              "Jordan",
              "Nike",
              "Adidas",
              "New Balance",
              "Asics",
              "On Running",
            ].map((brand) => (
              <Link
                key={brand}
                href={`/brands?brand=${encodeURIComponent(brand)}`}
              >
                {brand}
              </Link>
            ))}
            <Link className="home-directory-link" href="/brands">
              BROWSE DIRECTORY <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </section>
      <section className="home-featured-section">
        <div className="home-section-title">
          <div>
            <span>JUST LANDED · AUTHENTICALLY VERIFIED</span>
            <h2>Latest sneaker drops</h2>
            <p>New arrivals hand-checked and ready to ship.</p>
          </div>
          <Link href="/brands">
            VIEW ALL BRANDS <ArrowRight size={12} />
          </Link>
        </div>
        <div className="home-featured-grid">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={`featured-${product.id}`}
              product={product}
              onAdd={add}
              onOpen={setActive}
              wished={wish.includes(product.id)}
              onWish={(id) =>
                setWish((current) =>
                  current.includes(id)
                    ? current.filter((value) => value !== id)
                    : [...current, id],
                )
              }
            />
          ))}
        </div>
      </section>
      <section className="home-retro-banner">
        <div>
          <span>THE COURT CLASSICS COLLECTION</span>
          <h2>
            Jordan heritage.
            <br />
            Everyday culture.
          </h2>
          <p>Explore iconic retro silhouettes and limited-edition drops.</p>
          <Link href={`/brands?brand=${encodeURIComponent("Jordan")}`}>
            EXPLORE THE COLLECTION <ArrowRight size={12} />
          </Link>
        </div>
        <Link className="home-retro-product" href="/product/4">
          <img
            src={
              products.find((product) => product.id === 4)?.image ||
              productsSeed[3].image
            }
            alt="Jordan retro sneaker"
          />
          <span>DISCOVER THE RETRO EDITION ↗</span>
        </Link>
      </section>

      <section className="catalog-intro">
        <div className="breadcrumbs">
          HOME &nbsp;›&nbsp; SNEAKERS &nbsp;›&nbsp; <b>NIKE & ALL BRANDS</b>
        </div>
        <div className="catalog-heading-row">
          <div>
            <span className="verified-kicker">
              <i /> VERIFIED AUTHENTIC SILHOUETTES
            </span>
            <h1>Authentic Sneakers &amp; Streetwear</h1>
            <p>
              Hand-inspected, 100% verified deadstock runners, luxury
              collaborations, and hype court classics
              <br className="desktop-break" /> available across Bangladesh.
            </p>
          </div>
          <div className="catalog-controls">
            <span>
              INVENTORY &nbsp;<b>{products.length} Products</b>
            </span>
            <label>
              Sort by:{" "}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option>Featured Drops</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </label>
            <button
              className="filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>
        <div className="quick-select">
          <span>QUICK SELECT:</span>
          {[
            "All Brands",
            "Nike",
            "Air Jordan",
            "Adidas",
            "New Balance",
            "Asics",
            "On Running",
            "Slides & Slip-ons",
          ].map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
              {item === "All Brands" ? ` (${products.length})` : ""}
            </button>
          ))}
        </div>
      </section>

      <section className="catalog-content" id="catalog">
        <aside
          className={`filters-panel ${filtersOpen ? "filters-visible" : ""}`}
        >
          <div className="filter-title">
            <b>
              <SlidersHorizontal size={13} /> Filters
            </b>
            <button
              onClick={() => {
                setCheckedBrands([]);
                setMaxPrice(12500);
                setCategory("All Brands");
              }}
            >
              CLEAR ALL
            </button>
          </div>
          <div className="filter-group">
            <h3>BRAND COLLECTION</h3>
            <label className="brand-search">
              <Search size={12} />
              <input
                value={brandSearch}
                onChange={(event) => setBrandSearch(event.target.value)}
                placeholder="Filter brand..."
              />
            </label>
            {brands
              .filter((brand) =>
                brand.toLowerCase().includes(brandSearch.toLowerCase()),
              )
              .map((brand) => (
                <label className="check-row" key={brand}>
                  <input
                    type="checkbox"
                    checked={checkedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span>{brand}</span>
                  <small>
                    {[64, 48, 35, 32, 15, 12][brands.indexOf(brand)]}
                  </small>
                </label>
              ))}
          </div>
          <div className="filter-group">
            <div className="filter-group-heading">
              <h3>PRICE RANGE (BDT)</h3>
              <b>৳{maxPrice.toLocaleString("en-US")}</b>
            </div>
            <input
              className="price-range"
              type="range"
              min="2500"
              max="12500"
              step="500"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
            <div className="price-values">
              <span>
                Min
                <br />
                <b>৳2,500</b>
              </span>
              <span>
                Max
                <br />
                <b>{money(maxPrice)}</b>
              </span>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-group-heading">
              <h3>SELECT SIZE (EU)</h3>
              <small>Size Chart</small>
            </div>
            <div className="size-filter">
              {["40", "41", "42", "42.5", "43", "44", "45", "46"].map(
                (shoeSize) => (
                  <button
                    key={shoeSize}
                    className={size === shoeSize ? "selected" : ""}
                    onClick={() => setSize(shoeSize)}
                  >
                    {shoeSize}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="filter-group">
            <h3>CATEGORY</h3>
            {[
              "Road Racing & Marathon",
              "Hype Retro & Collabs",
              "Lifestyle Classics",
              "Slides & Sandals",
              "Shoe Care & Crep Protect",
            ].map((item, index) => (
              <label className="check-row" key={item}>
                <input type="checkbox" defaultChecked={index < 2} />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>HUB &amp; OUTLET LOCATION</h3>
            {[
              "Dhaka Central Hub",
              "Rajshahi Alakar Mor",
              "Bogura Jaleshwaritola",
              "Fast Express (24h Delivery)",
            ].map((item, index) => (
              <label className="check-row" key={item}>
                <input type="checkbox" defaultChecked={index < 2} />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <button
            className="apply-filters"
            onClick={() => setFiltersOpen(false)}
          >
            APPLY ACTIVE FILTERS <Check size={14} />
          </button>
        </aside>

        <div className="catalog-results">
          <div className="active-filters">
            <span>ACTIVE:</span>
            {(category !== "All Brands" ? [category] : [])
              .concat(checkedBrands)
              .map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    item === category
                      ? setCategory("All Brands")
                      : toggleBrand(item)
                  }
                >
                  {item} <X size={11} />
                </button>
              ))}
            {maxPrice < 12500 && (
              <button onClick={() => setMaxPrice(12500)}>
                Under {money(maxPrice)} <X size={11} />
              </button>
            )}
          </div>
          {shown.length ? (
            <div className="catalog-grid">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={add}
                  onOpen={setActive}
                  wished={wish.includes(product.id)}
                  onWish={(id) =>
                    setWish((current) =>
                      current.includes(id)
                        ? current.filter((value) => value !== id)
                        : [...current, id],
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <Search size={22} />
              <b>No matching sneakers found</b>
              <span>Try changing your search or clearing some filters.</span>
            </div>
          )}
          <div className="pagination">
            <span>
              Showing{" "}
              <b>
                {shown.length ? (page - 1) * pageSize + 1 : 0} -{" "}
                {Math.min(page * pageSize, shown.length)}
              </b>{" "}
              of <b>{shown.length}</b> verified items
            </span>
            <div>
              <button
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                ←
              </button>
              {pageNumbers.map((number, index) =>
                number === null ? (
                  <i key={`ellipsis-${index}`}>...</i>
                ) : (
                  <button
                    className={number === page ? "current-page" : ""}
                    key={number}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                aria-label="Next page"
                disabled={page === pageCount}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
              >
                Next ›
              </button>
            </div>
            <label>
              DISPLAY{" "}
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
              >
                <option value={12}>12 Items</option>
                <option value={24}>24 Items</option>
              </select>
            </label>
          </div>
          <div className="catalog-benefits">
            <div>
              <ShieldCheck />
              <span>
                <b>100% Legit Check</b>
                <small>
                  Every pair inspected by certified sneaker experts before
                  shipping.
                </small>
              </span>
            </div>
            <div>
              <Truck />
              <span>
                <b>Bangladesh Express</b>
                <small>
                  24h dispatch in Dhaka, Rajshahi, Bogura, and nationwide
                  courier.
                </small>
              </span>
            </div>
            <div>
              <span className="exchange-icon">↻</span>
              <span>
                <b>Direct Hub Exchange</b>
                <small>
                  Hassle-free size exchange within 7 days at our branch outlets.
                </small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="catalog-footer" id="footer">
        <div className="footer-grid">
          <div>
            <Link className="brand footer-brand" href="/">
              T-SHOE<span className="green-dot">•</span>
            </Link>
            <p>
              Bangladesh's premiere authentic sneaker and urban streetwear
              marketplace. Sourcing genuine hype silhouettes, limited editions,
              luxury slides, and street essentials direct from global
              distributors.
            </p>
            <div className="support-box">
              <small>CUSTOMER SUPPORT HOTLINE</small>
              <b>☎ 01747295464</b>
              <span>Available 10:00 AM–10:00 PM (Everyday)</span>
            </div>
          </div>
          <div>
            <h4>BRANCH OUTLETS</h4>
            <b>◉ RAJSHAHI OUTLET</b>
            <p>
              Shop 104, Level 1, Alakar Mor, Ghoramara, Rajshahi-6100,
              Bangladesh
            </p>
            <b>◉ BOGURA OUTLET</b>
            <p>
              Holding 42, Jaleshwaritola Main Road, Bogura Sadar, Bogura-5800,
              Bangladesh
            </p>
          </div>
          <div>
            <h4>QUICK NAVIGATION</h4>
            <Link href="/">Home</Link>
            <Link href="/brands">Brand Directory</Link>
            <Link href="/product/1">Featured Product</Link>
            <Link href="/checkout">Shopping Cart &amp; Checkout</Link>
            <Link href="/payment">Payment Options</Link>
            <Link href="/orders">Order History</Link>
            <Link href="/order-tracking">Track Your Order</Link>
          </div>
          <div>
            <h4>SELLER ZONE &amp; CONNECT</h4>
            <a href="#footer">Register as Merchant</a>
            <a href="#footer">Seller Center Portal</a>
            <a href="#footer">Merchant Standards</a>
            <h4 className="community-title">COMMUNITY</h4>
            <div className="social-links">
              <a href="#footer">
                <MessageCircle style={{ width: "14px" }} />
              </a>
              <a href="#footer">▣</a>
              <a href="#footer">▧</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <span>
            © 2026 Tarek Hossain. All rights reserved. &nbsp; Privacy Policy
            &nbsp; · &nbsp; Terms of Service
          </span>
          <span>
            TRUSTED PAYMENT: &nbsp; BKASH &nbsp; NAGAD &nbsp; VISA &nbsp;
            MASTERCARD &nbsp; COD
          </span>
        </div>
      </footer>

      {active && (
        <div className="overlay" onClick={() => setActive(null)}>
          <div
            className="quick-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X />
            </button>
            <img src={active.image} alt={active.name} />
            <div>
              <span className="kicker">{active.category}</span>
              <h2>{active.name}</h2>
              <b className="modal-price">{money(active.price)}</b>
              <p>{active.description}</p>
              <h4>SELECT SIZE (EU)</h4>
              <div className="size-list">
                {["39", "40", "41", "42", "43", "44"].map((shoeSize) => (
                  <button
                    className={size === shoeSize ? "selected" : ""}
                    key={shoeSize}
                    onClick={() => setSize(shoeSize)}
                  >
                    {shoeSize}
                  </button>
                ))}
              </div>
              <button className="add-main" onClick={() => add(active, size)}>
                ADD TO BAG — {money(active.price)}
              </button>
            </div>
          </div>
        </div>
      )}
      {drawer && (
        <div className="drawer-overlay" onClick={() => setDrawer(false)}>
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <span className="kicker">T-SHOES</span>
                <h2>Your Bag ({count} items)</h2>
              </div>
              <button onClick={() => setDrawer(false)} aria-label="Close cart">
                <X />
              </button>
            </div>
            {cart.length === 0 ? (
              <p>Your bag is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  className="cart-item"
                  key={`${item.product.id}-${item.size}`}
                >
                  <img src={item.product.image} alt={item.product.name} />
                  <div>
                    <b>{item.product.name}</b>
                    <small>EU {item.size} · In stock</small>
                    <strong>{money(item.product.price * item.qty)}</strong>
                    <div className="qty-control">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, -1)
                        }
                      >
                        <Minus size={12} />
                      </button>
                      {item.qty}
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, 1)
                        }
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        className="remove"
                        onClick={() =>
                          setCart((current) =>
                            current.filter((row) => row !== item),
                          )
                        }
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="drawer-total">
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <a
              className="checkout-btn"
              href="/checkout"
              onClick={() => setDrawer(false)}
            >
              PROCEED TO CHECKOUT
            </a>
            <p className="drawer-note">
              <ShieldCheck size={15} /> Secure checkout · 7-day easy exchange
            </p>
          </aside>
        </div>
      )}
      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
        </div>
      )}
    </main>
  );
}
