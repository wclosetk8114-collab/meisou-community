import { verifyWebhook } from "@/lib/stripe";
import { q } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const ev = verifyWebhook(body, req.headers.get("stripe-signature"));
  if (!ev) return new Response("bad signature", { status: 400 });
  const obj = ev.data?.object || {};
  // サブスクが終わった（解約・支払い失敗で停止）→ 会員ページを閉じる
  if (ev.type === "customer.subscription.deleted" && obj.id) {
    await q("update meisou.members set status='canceled', canceled_at=now() where stripe_subscription_id=$1 and status='active'", [obj.id]);
  }
  // 再開・更新で有効に戻った
  if (ev.type === "customer.subscription.updated" && obj.id && obj.status === "active") {
    await q("update meisou.members set status='active', canceled_at=null where stripe_subscription_id=$1", [obj.id]);
  }
  return Response.json({ received: true });
}
