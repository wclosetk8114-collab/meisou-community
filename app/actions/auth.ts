"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { one, q } from "@/lib/db";
import { startSession, endSession, requireMember } from "@/lib/auth";

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
  if (!name || !email || !password) back("/signup", "すべて入力してください");
  if (password.length < 8) back("/signup", "パスワードは8文字以上にしてください");
  const need = process.env.SIGNUP_CODE || "";
  if (need && code !== need) back("/signup", "参加コードがちがいます");
  const exists = await one("select id from meisou.members where email=$1", [email]);
  if (exists) back("/signup", "このメールアドレスはすでに登録されています。ログインしてください");
  const admins = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map((s) => s.trim());
  const isAdmin = admins.includes(email);
  const hash = await bcrypt.hash(password, 10);
  const m = await one<{ id: string }>(
    "insert into meisou.members (email,password_hash,name,is_admin,course_access) values ($1,$2,$3,$4,$4) returning id",
    [email, hash, name, isAdmin]);
  await startSession(m!.id);
  redirect("/app");
}

export async function logout() {
  await endSession();
  redirect("/");
}

export async function cancelMembership(fd: FormData) {
  const m = await requireMember();
  if (String(fd.get("confirm")) !== "yes") redirect("/app/account?e=" + encodeURIComponent("確認のチェックを入れてください"));
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
