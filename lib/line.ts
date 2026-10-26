import crypto from "crypto";
import { q } from "./db";

const TOKEN = () => process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
export const lineReady = () => !!TOKEN();

export function verifyLine(body: string, sig: string | null) {
  const secret = process.env.LINE_CHANNEL_SECRET || "";
  if (!secret || !sig) return false;
  const h = crypto.createHmac("sha256", secret).update(body).digest("base64");
  try { return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig)); } catch { return false; }
}

const text = (t: string) => ({ type: "text", text: t.slice(0, 4900) });

async function api(path: string, payload: any) {
  if (!lineReady()) return;
  const r = await fetch(`https://api.line.me/v2/bot/message/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN()}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) console.error("LINE", path, r.status, await r.text());
}

export const reply = (replyToken: string, ...msgs: string[]) => api("reply", { replyToken, messages: msgs.slice(0, 5).map(text) });
export const push = (to: string, ...msgs: string[]) => api("push", { to, messages: msgs.slice(0, 5).map(text) });

/** 有効な会員でLINEをつないでいる人全員に送る（500人ずつ） */
export async function pushToMembers(msg: string, onlyIds?: string[]) {
  if (!lineReady()) return 0;
  const rows = await q<{ line_user_id: string }>(
    `select line_user_id from meisou.members where line_user_id is not null and (status='active' or is_admin)
     ${onlyIds ? "and id = any($1)" : ""}`, onlyIds ? [onlyIds] : []);
  const ids = rows.map((r) => r.line_user_id);
  for (let i = 0; i < ids.length; i += 500) await api("multicast", { to: ids.slice(i, i + 500), messages: [text(msg)] });
  return ids.length;
}
