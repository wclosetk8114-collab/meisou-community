"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { one, q } from "@/lib/db";
import { startSession, endSession, requireMember } from "@/lib/auth";
import { getPaidSession, cancelSubscription } from "@/lib/stripe";

const back = (path: string, e: string) => redirect(`${path}?e=${encodeURIComponent(e)}`);

export async function login(fd: FormData) {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const m = await one<{ id: string; password_hash: string; status: string; is_admin: boolean }>(
    "select id,password_hash,status,is_admin from meisou.members where email=$1", [email]);
  if (!m || !(await bcrypt.compare(password, m.password_hash))) back("/login", "メールアドレスかパスワードがちがいます");
  await startSession(m!.id);
  if (m!.status !== "active" && !m!.is_admin) redirect("/left");
  redirect("/app");
}

export async function signup(fd: FormData) {
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const code = String(fd.get("code") || "").trim();
  const sessionId = String(fd.get("session_id") || "").trim();
  const from = sessionId ? `/welcome?session_id=${encodeURIComponent(sessionId)}&x=1` : "/signup";
  const fail = (msg: string) => redirect(`${from}${from.includes("?") ? "&" : "?"}e=${encodeURIComponent(msg)}`);
  if (!name || !email || !password) fail("すべて入力してください");
  if (password.length < 8) fail("パスワードは8文字以上にしてください");

  // 決済から来た人：Stripe で支払い済みかを確認（参加コード不要）
  const paid = sessionId ? await getPaidSession(sessionId) : null;
  if (sessionId && !paid) fail("決済を確認できませんでした");
  if (!paid) {
    const need = process.env.SIGNUP_CODE || "";
    if (need && code !== need) fail("参加コードがちがいます");
  }
  if (paid) {
    const used = await one("select id from meisou.members where stripe_session_id=$1", [paid.id]);
    if (used) redirect("/login");
  }

  const hash = await bcrypt.hash(password, 10);
  const exists = await one<{ id: string }>("select id from meisou.members where email=$1", [email]);
  if (exists && !paid) fail("このメールアドレスはすでに登録されています。ログインしてください");

  let id: string;
  if (exists && paid) {
    // 以前の会員がもう一度入った → 有効に戻す
    await q(`update meisou.members set status='active', canceled_at=null, password_hash=$1, name=$2,
      stripe_customer_id=$3, stripe_subscription_id=$4, stripe_session_id=$5 where id=$6`,
      [hash, name, paid.customer, paid.subscription, paid.id, exists.id]);
    id = exists.id;
  } else {
    const admins = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map((s) => s.trim());
    const isAdmin = admins.includes(email);
    const m = await one<{ id: string }>(
      `insert into meisou.members (email,password_hash,name,is_admin,course_access,stripe_customer_id,stripe_subscription_id,stripe_session_id)
       values ($1,$2,$3,$4,$4,$5,$6,$7) returning id`,
      [email, hash, name, isAdmin, paid?.customer || null, paid?.subscription || null, paid?.id || null]);
    id = m!.id;
  }
  await startSession(id);
  redirect("/app/start");
}

export async function logout() {
  await endSession();
  redirect("/");
}

export async function cancelMembership(fd: FormData) {
  const m = await requireMember();
  if (String(fd.get("confirm")) !== "yes") redirect("/app/account?e=" + encodeURIComponent("確認のチェックを入れてください"));
  const row = await one<{ stripe_subscription_id: string | null }>("select stripe_subscription_id from meisou.members where id=$1", [m.id]);
  if (row?.stripe_subscription_id) await cancelSubscription(row.stripe_subscription_id); // 次回からの請求を止める
  await q("update meisou.members set status='canceled', canceled_at=now() where id=$1", [m.id]);
  redirect("/left");
}

export async function changePassword(fd: FormData) {
  const m = await requireMember();
  const cur = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  const row = await one<{ password_hash: string }>("select password_hash from meisou.members where id=$1", [m.id]);
  if (!row || !(await bcrypt.compare(cur, row.password_hash))) redirect("/app/account?e=" + encodeURIComponent("今のパスワードがちがいます"));
  if (next.length < 8) redirect("/app/account?e=" + encodeURIComponent("新しいパスワードは8文字以上にしてください"));
  await q("update meisou.members set password_hash=$1 where id=$2", [await bcrypt.hash(next, 10), m.id]);
  redirect("/app/account?ok=" + encodeURIComponent("パスワードを変更しました"));
}
