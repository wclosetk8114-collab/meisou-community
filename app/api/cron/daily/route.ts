import { q } from "@/lib/db";
import { push, pushToMembers, lineReady } from "@/lib/line";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** 毎晩21時（日本時間）に Vercel Cron から呼ばれる */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const ua = req.headers.get("user-agent") || "";
  if (secret ? auth !== `Bearer ${secret}` : !ua.includes("vercel-cron")) return new Response("forbidden", { status: 403 });
  if (!lineReady()) return Response.json({ skipped: "LINE not configured" });

  // 1) 今日まだ瞑想していない人へリマインド
  const rows = await q<{ line_user_id: string; name: string }>(
    `select line_user_id, name from meisou.members m
     where line_user_id is not null and line_remind and status='active'
       and not exists (select 1 from meisou.meditation_logs l where l.member_id=m.id and l.day=(now() at time zone 'Asia/Tokyo')::date)`);
  for (const r of rows) await push(r.line_user_id, `${r.name}さん、今日の瞑想はまだです。\n3分だけでも、静けさにもどりましょう。\n\n${SITE.url}/app/meditate\n（終わったら「瞑想した」と送るだけで記録できます）`);

  // 2) 明日の思想講座をお知らせ
  const lives = await q<{ id: string; title: string; t: string }>(
    `select id, title, to_char(starts_at at time zone 'Asia/Tokyo','MM月DD日 HH24:MI') t from meisou.live_sessions
     where notified_at is null and (starts_at at time zone 'Asia/Tokyo')::date = (now() at time zone 'Asia/Tokyo')::date + 1`);
  for (const l of lives) {
    await pushToMembers(`【明日】月1回 思想講座\n「${l.title}」\n${l.t}〜 オンライン\n\n参加URLはこちら\n${SITE.url}/app/live`);
    await q("update meisou.live_sessions set notified_at=now() where id=$1", [l.id]);
  }
  return Response.json({ reminded: rows.length, lives: lives.length });
}
