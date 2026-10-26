import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { one } from "./db";

const COOKIE = "hm_session";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret-change-me");

export type Member = {
  id: string; email: string; name: string; status: string;
  is_admin: boolean; course_access: boolean; created_at: string;
};

export async function startSession(memberId: string) {
  const token = await new SignJWT({ sub: memberId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}
export async function endSession() {
  (await cookies()).delete(COOKIE);
}
export async function currentMember(): Promise<Member | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return await one<Member>("select id,email,name,status,is_admin,course_access,created_at from meisou.members where id=$1", [payload.sub]);
  } catch {
    return null;
  }
}
/** 会員ページ用：ログイン＋有効会員でなければ入れない */
export async function requireMember() {
  const m = await currentMember();
  if (!m) redirect("/login");
  if (m.status !== "active" && !m.is_admin) redirect("/left");
  return m;
}
export async function requireCourse() {
  const m = await requireMember();
  if (!m.course_access && !m.is_admin) redirect("/app/course");
  return m;
}
export async function requireAdmin() {
  const m = await currentMember();
  if (!m || !m.is_admin) redirect("/login");
  return m;
}
