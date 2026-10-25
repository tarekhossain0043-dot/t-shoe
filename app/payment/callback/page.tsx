"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";
import { apiRequest } from "../../../lib/auth";

type Result = "checking" | "success" | "cancelled" | "failed";

export default function PaymentCallbackPage() {
  const [result, setResult] = useState<Result>("checking");
  const [message, setMessage] = useState("Confirming the payment with the provider…");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams(window.location.search);
    const provider = query.get("provider");
    const order = query.get("order_number") || "";
    const paymentId = query.get("paymentID") || "";
    setOrderNumber(order);

    async function verify() {
      if (provider === "success") {
        if (active) {
          setResult("success");
          setMessage("Nagad confirmed this payment on the server.");
        }
        return;
      }
      if (provider === "cancelled" || query.get("status")?.toLowerCase() === "cancel") {
        if (active) {
          setResult("cancelled");
          setMessage("The payment was cancelled. Your order remains unpaid.");
        }
        return;
      }
      if (provider !== "return" || !order || !paymentId) {
        if (active) {
          setResult("failed");
          setMessage("The payment could not be verified. Your order has not been marked paid.");
        }
        return;
      }
      try {
        await apiRequest<{ payment_status: string }>("/payments/bkash/complete/", {
          method: "POST",
          body: JSON.stringify({ order_number: order, paymentID: paymentId }),
        });
        if (active) {
          setResult("success");
          setMessage("bKash confirmed this payment on the server.");
        }
      } catch (error) {
        if (active) {
          setResult("failed");
          setMessage(error instanceof Error
            ? `${error.message} Your order has not been marked paid.`
            : "The payment could not be verified. Your order has not been marked paid.");
        }
      }
    }

    void verify();
    return () => {
      active = false;
    };
  }, []);

  const Icon = result === "checking" ? LoaderCircle : result === "success" ? CheckCircle2 : CircleAlert;
  return (
    <main className="payment-page">
      <header className="payment-header"><Link className="brand" href="/">T-SHOE<span className="green-dot">•</span></Link></header>
      <section className="payment-empty">
        <Icon size={30} aria-hidden="true" />
        <h1>{result === "checking" ? "Verifying payment" : result === "success" ? "Payment confirmed" : result === "cancelled" ? "Payment cancelled" : "Payment not verified"}</h1>
        <p>{message}</p>
        {orderNumber && <p>Order reference: <b>#{orderNumber}</b></p>}
        <p><ShieldCheck size={14} /> The order is marked paid only after server-side provider verification.</p>
        <div>
          <Link href="/orders" className="payment-confirm">VIEW ORDERS</Link>
          {result !== "success" && <Link href="/payment" className="payment-confirm">RETURN TO CHECKOUT</Link>}
        </div>
      </section>
    </main>
  );
}
