import { verifyLine, reply } from "@/lib/line";
import { q, one } from "@/lib/db";
import { myStats } from "@/lib/stats";
import { answerWithAI } from "@/lib/knowledge";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HELP = `KUU公式LINEでできること

・「瞑想した」と送る → 今日の瞑想を記録（「瞑想した 10分」もOK）
・「質問 〜」と送る → つっちーAIが答えます
・「記録」と送る → 続いた日数を確認
・毎晩21時、まだの日だけお知らせが届きます

会員サイト：${SITE.url}/app`;

const z2h = (s: string) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

export async function POST(req: Request) {
  const body = await req.text();
  if (!verifyLine(body, req.headers.get("x-line-signature"))) return new Response("bad signature", { status: 400 });
  const { events = [] } = JSON.parse(body);
  for (const ev of events) {
    try { await handle(ev); } catch (e: any) { console.error("line event", e?.message); }
  }
  return Response.json({ ok: true });
}

async function handle(ev: any) {
  const uid: string | undefined = ev.source?.userId;
  const rt: string | undefined = ev.replyToken;
  if (!uid || !rt) return;

  if (ev.type === "follow") {
    const m = await one("select id from meisou.members where line_user_id=$1", [uid]);
    if (m) return reply(rt, "おかえりなさい。会員サイトとつながっています。\n\n" + HELP);
    return reply(rt, `KUU公式LINEへようこそ。\n\n会員の方は、会員サイトのマイページに出る「6けたのコード」をここに送ってください。LINEと会員サイトがつながります。\n\nマイページ：${SITE.url}/app/account`);
  }
  if (ev.type !== "message" || ev.message?.type !== "text") return;
  const raw = String(ev.message.text || "").trim();
  const t = z2h(raw);

  // 6けたのコード → つなぐ
  if (/^\d{6}$/.test(t)) {
    const m = await one<{ id: string; name: string }>(
      "select id, name from meisou.members where line_link_code=$1 and line_code_expires > now()", [t]);
    if (!m) return reply(rt, "コードが見つからないか、期限が切れています。マイページでもう一度コードを出してください。");
    await q("update meisou.members set line_user_id=null where line_user_id=$1", [uid]);
    await q("update meisou.members set line_user_id=$1, line_link_code=null, line_code_expires=null where id=$2", [uid, m.id]);
    return reply(rt, `${m.name}さん、会員サイトとつながりました。\n\n` + HELP);
  }

  const m = await one<{ id: string; name: string; status: string; is_admin: boolean }>(
    "select id, name, status, is_admin from meisou.members where line_user_id=$1", [uid]);
  if (!m) return reply(rt, `まだ会員サイトとつながっていません。\n会員の方は、マイページに出る6けたのコードをここに送ってください。\n${SITE.url}/app/account\n\nKUUについて：${SITE.url}`);
  if (m.status !== "active" && !m.is_admin) return reply(rt, `退会済みのため、この機能は使えません。また始めるときはこちらから：${SITE.url}`);

  // 瞑想の記録
  if (/^(瞑想|めいそう)/.test(t) && !/^(瞑想|めいそう)(の)?(質問|しつもん)/.test(t)) {
    const min = Math.min(180, Number((t.match(/(\d+)\s*分/) || [])[1] || 0));
    await q("insert into meisou.meditation_logs (member_id, day, minutes, note) values ($1,(now() at time zone 'Asia/Tokyo')::date,$2,'')", [m.id, min]);
    const s = await myStats(m.id);
    return reply(rt, `記録しました${min ? `（${min}分）` : ""}。\n今日で${s.streak}日連続です。\n\n明日もまた、静けさにもどりましょう。`);
  }

  if (/^(記録|きろく|日数)$/.test(t)) {
    const s = await myStats(m.id);
    return reply(rt, `${m.name}さんの記録\n\n・連続：${s.streak}日\n・合計：${s.totalDays}日（${s.totalMin}分）\n・今日：${s.doneToday ? "できました" : "まだです"}`);
  }

  // 質問 → つっちーAI
  const qm = raw.match(/^(質問|しつもん)[\s　:：、]*([\s\S]*)$/);
  if (qm) {
    const question = qm[2].trim().slice(0, 1000);
    if (!question) return reply(rt, "「質問」のあとに続けて書いてください。\n例：質問 瞑想中に眠くなります");
    const cnt = await one<{ c: string }>("select count(*) c from meisou.questions where member_id=$1 and created_at > now() - interval '1 day'", [m.id]);
    if (Number(cnt?.c || 0) >= 5) return reply(rt, "質問は1日5件までです。また明日どうぞ。");
    const row = await one<{ id: string }>("insert into meisou.questions (member_id, question, is_public) values ($1,$2,false) returning id", [m.id, question]);
    try {
      const a = await answerWithAI(question);
      if (a.text) {
        const clean = a.text.replace(/\*\*/g, "").replace(/^#+\s*/gm, "");
        await q("update meisou.questions set answer=$1, refs=$2, by_ai=true, answered_at=now() where id=$3", [clean, JSON.stringify(a.refs), row!.id]);
        const refs = a.refs.length ? "\n\n参考記事\n" + a.refs.map((r: any) => `・${r.title}\n${r.url.startsWith("http") ? r.url : SITE.url + r.url}`).join("\n") : "";
        return reply(rt, "つっちーAIより\n\n" + clean + refs);
      }
    } catch (e: any) { console.error("line ask", e?.message); }
    return reply(rt, `質問を受け付けました。回答は会員サイトの質問ページに出ます。\n${SITE.url}/app/qa`);
  }

  return reply(rt, HELP);
}
