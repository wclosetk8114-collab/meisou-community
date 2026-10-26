import crypto from "crypto";

const KEY = () => process.env.STRIPE_SECRET_KEY || "";
export const stripeReady = () => !!KEY();

async function call(method: string, path: string, params?: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY()}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params ? new URLSearchParams(params).toString() : undefined,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${res.status}`);
  return json;
}

export type PaidSession = { id: string; email: string; name: string; customer: string; subscription: string };

/** 決済が完了したチェックアウトか確認して、メール等を返す */
export async function getPaidSession(id: string): Promise<PaidSession | null> {
  if (!stripeReady() || !/^cs_[\w]+$/.test(id)) return null;
  try {
    const s = await call("GET", `/checkout/sessions/${id}`);
    const ok = s.status === "complete" && (s.payment_status === "paid" || s.payment_status === "no_payment_required");
    if (!ok) return null;
    return {
      id: s.id,
      email: String(s.customer_details?.email || s.customer_email || "").toLowerCase(),
      name: String(s.customer_details?.name || ""),
      customer: typeof s.customer === "string" ? s.customer : s.customer?.id || "",
      subscription: typeof s.subscription === "string" ? s.subscription : s.subscription?.id || "",
    };
  } catch (e: any) {
    console.error("getPaidSession", e?.message);
    return null;
  }
}

export async function cancelSubscription(subId: string) {
  if (!stripeReady() || !subId) return;
  try { await call("DELETE", `/subscriptions/${subId}`); } catch (e: any) { console.error("cancelSubscription", e?.message); }
}

/** Webhook の署名チェック */
export function verifyWebhook(body: string, header: string | null): any | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!secret || !header) return null;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const t = parts["t"], v1 = parts["v1"];
  if (!t || !v1) return null;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) return null;
  } catch { return null; }
  if (Math.abs(Date.now() / 1000 - Number(t)) > 600) return null;
  return JSON.parse(body);
}
