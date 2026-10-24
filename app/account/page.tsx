"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, Smartphone, Truck, Wallet } from "lucide-react";
import { getCurrentMember, loginMember, logoutMember, registerMember, type Member } from "../../lib/auth";

export default function AccountPage() {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [notice, setNotice] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCurrentMember().then(setMember).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Unable to verify your saved session.");
    });
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const authenticatedMember = mode === "signin"
        ? await loginMember(identifier, password, remember)
        : await registerMember(fullName, identifier, email, password, remember);
      if (!authenticatedMember) throw new Error("Authentication completed without a member profile.");
      setMember(authenticatedMember);
      setPassword("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await logoutMember();
      setMember(null);
      setNotice("You have signed out.");
    } catch (error) {
      setMember(null);
      setNotice(error instanceof Error ? error.message : "Signed out on this device.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="member-page">
      <div className="topline"><span>☎ HELPLINE: 01742528116</span><span>BANGLADESH EXPRESS DELIVERY</span><a href="#footer">▣ BECOME A SELLER</a><a href="#footer">♙ LOGIN TO SELLER</a></div>
      <header className="main-header">
        <Link className="brand" href="/"><span>T-SHOE<span className="green-dot">•</span></span><small>EST. BD</small></Link>
        <label className="searchbox"><span aria-hidden="true">⌕</span><input placeholder="Search exclusive sneakers, slides, authentic drops, brands..." /><button type="button">SEARCH</button></label>
        <Link className="header-icon member-header-link" href="/notifications" aria-label="Notifications">♧</Link>
        <Link className="cart-pill" href="/"><Wallet size={15} /><span>CART<br /><b>৳0.00</b></span></Link>
      </header>
      <nav className="navline member-nav"><Link className="category-link" href="/">☷ &nbsp; Categories (See All)</Link>{["Home", "New Arrivals", "Sneakers", "Slides & Sandals", "Accessories", "Releases", "Stock Cleaness", "Upcoming"].map((item) => <Link href="/" key={item}>{item}</Link>)}<span>◉ &nbsp;100% AUTHENTIC GUARANTEED</span></nav>
      <div className="member-breadcrumb"><Link href="/">HOME</Link><span>›</span><b>MEMBER PORTAL ACCESS</b><span className="member-secure"><LockKeyhole size={11} /> 256-BIT SSL SECURED TERMINAL</span></div>
      <section className="member-layout">
        <aside className="member-promo">
          <div className="member-promo-logo">T-SHOE<span>•</span></div>
          <small className="member-eyebrow">THE VAULT MEMBERSHIP</small>
          <h1>Unlock Bangladesh&apos;s Exclusive Sneaker Circle.</h1>
          <p>Step into verified drops, early access, and instant member-only retail perks across Dhaka, Rajshahi, and Bogura outlets.</p>
          <div className="member-featured">
            <span className="member-priority">PRIORITY DROP</span>
            <div className="member-feature-image"><span>T-SHOE</span><img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=85" alt="Featured sneaker" /></div>
            <b>Tier-1 Member Allocation <i>↯ INSTANT QUEUE</i></b>
          </div>
          <div className="member-perks-title">PRIVILEGES &amp; GUARANTEES</div>
          <div className="member-perk"><ShieldCheck /><span><b>100% Genuine Sneaker Passport</b><small>Digital NFC/QR verified serial tracking for every pair bought.</small></span></div>
          <div className="member-perk"><Truck /><span><b>Rajshahi &amp; Bogura VIP Perks</b><small>Walk-in priority fit rooms, reserved sizes, and physical redemption.</small></span></div>
          <div className="member-perk"><Smartphone /><span><b>Instant WhatsApp Drop Pings</b><small>Real-time alerts 15 minutes before public hype shoe launches.</small></span></div>
        </aside>
        <section className="member-form-side">
          <div className="member-form">
            <div className="member-tabs"><button className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setNotice(""); }}>Sign In</button><button className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setNotice(""); }}>Create Account</button><small>Need help? <a href="tel:01742528116">01742528116</a></small></div>
            {member ? <div className="member-account">
              <span className="member-account-check"><ShieldCheck size={21} /></span>
              <small>SECURE MEMBER SESSION</small>
              <h2>Welcome, {member.name}.</h2>
              <p>Your T-SHOE account is verified and signed in.</p>
              <div><b>PHONE</b><span>{member.phone}</span></div>
              <div><b>EMAIL</b><span>{member.email}</span></div>
              <div className="member-account-actions"><Link href="/orders">Order history</Link><Link href="/notifications">Drop notifications</Link></div>
              <button className="member-submit" disabled={busy} onClick={signOut}>{busy ? "SIGNING OUT…" : "SIGN OUT"} <span>→</span></button>
            </div> : <>
            <h2>{mode === "signin" ? "Welcome Back, Collector." : "Join the Sneaker Circle."}</h2>
            <p>{mode === "signin" ? "Log in to view your orders, saved sneakers, and exclusive cart discounts." : "Create your member profile to unlock verified drops and order tracking."}</p>
            <div className="member-sso"><button type="button" onClick={() => setNotice("Google sign-in is not configured. Use your phone/email and password.")}><b className="google-g">G</b> Google Account</button><button type="button" onClick={() => setNotice("SMS OTP sign-in is not configured yet. Use your phone/email and password.")}><Smartphone size={13} /> Instant SMS OTP</button></div>
            <div className="member-or"><span>OR CONTINUE WITH CREDENTIALS</span></div>
            <form onSubmit={submit}>
              {mode === "create" && <label>FULL NAME<input required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" /></label>}
              <label>{mode === "signin" ? "MOBILE PHONE OR EMAIL ADDRESS" : "MOBILE PHONE NUMBER"}<input id="member-phone" required autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={mode === "signin" ? "BD +880    01742 528116 or name@gmail.com" : "+880 17XXXXXXXX"} /></label>
              {mode === "create" && <label>EMAIL ADDRESS<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>}
              <label>ACCOUNT PASSWORD {mode === "signin" && <button type="button" className="forgot-password" onClick={() => setNotice("Password reset is unavailable. Please contact customer support for account help.")}>FORGOT PASSWORD?</button>}<span className="password-input"><input required minLength={mode === "create" ? 8 : undefined} autoComplete={mode === "signin" ? "current-password" : "new-password"} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "create" ? "At least 8 characters" : "••••••••••••"} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></span></label>
              <div className="member-remember"><label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Stay signed in for 30 days</label><span><LockKeyhole size={10} /> Encrypted</span></div>
              <button className="member-submit" type="submit" disabled={busy}>{busy ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN TO T-SHOE" : "CREATE T-SHOE ACCOUNT"} <span>→</span></button>
            </form>
            </>}
            {!member && notice && <p className="member-notice" role="alert">{notice}</p>}
          </div>
          <div className="merchant-prompt"><span>▦</span><p><b>Are you a verified sneaker merchant?</b><small>List inventory directly to verified hypeheads across Bangladesh.</small></p><a href="mailto:seller@t-shoe.com">MERCHANT PORTAL ↗</a></div>
        </section>
      </section>
      <div className="member-benefits"><div><Truck /><b>64 District Delivery</b><small>Pathao &amp; Steadfast Express</small></div><div><span>↻</span><b>3-Day Size Exchange</b><small>Hassle-free replacement</small></div><div><ShieldCheck /><b>100% Authentic Check</b><small>UV &amp; stitching inspection</small></div><div><Wallet /><b>Cash On Delivery</b><small>Pay upon physical inspection</small></div></div>
      <footer className="catalog-footer" id="footer"><div className="footer-grid"><div><Link className="brand footer-brand" href="/">T-SHOE<span className="green-dot">•</span></Link><p>Bangladesh&apos;s premium authentic sneaker and urban streetwear marketplace. Sourcing genuine hype silhouettes, limited editions, and street essentials direct from global distributors.</p><div className="support-box"><small>CUSTOMER SUPPORT HOTLINE</small><b>☎ 01300714517</b><span>Available 10:00 AM–10:00 PM (Everyday)</span></div></div><div><h4>BRANCH OUTLETS</h4><b>◉ RAJSHAHI OUTLET</b><p>Shop 104, Level 1, Alakar Mor, Ghoramara, Rajshahi, Bangladesh</p><b>◉ BOGURA OUTLET</b><p>Holding 42, Jaleshwaritola Main Road, Bogura, Bangladesh</p></div><div><h4>QUICK NAVIGATION</h4><Link href="/">About T-Shoe</Link><Link href="/">Authenticity Guarantee</Link><Link href="/orders">Order History &amp; Tracking</Link><Link href="/">Shipping &amp; Exchange</Link></div><div id="footer-seller"><h4>SELLER ZONE &amp; CONNECT</h4><a href="mailto:seller@t-shoe.com">Register as Merchant</a><a href="mailto:seller@t-shoe.com">Seller Center Portal</a><a href="mailto:seller@t-shoe.com">Merchant Standards</a></div></div><div className="copyright"><span>© 2026 T-Shoe. All rights reserved. &nbsp; Privacy Policy &nbsp; · &nbsp; Terms of Service</span><span>TRUSTED PAYMENT: &nbsp; BKASH &nbsp; NAGAD &nbsp; VISA &nbsp; MASTERCARD &nbsp; COD</span></div></footer>
    </main>
  );
}
