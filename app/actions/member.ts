"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Anthropic from "@anthropic-ai/sdk";
import { q, one } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function logMeditation(minutes: number, note: string) {
  const m = await requireMember();
  const min = Math.max(0, Math.min(180, Math.round(Number(minutes) || 0)));
  await q("insert into meisou.meditation_logs (member_id, day, minutes, note) values ($1, (now() at time zone 'Asia/Tokyo')::date, $2, $3)",
    [m.id, min, String(note || "").slice(0, 300)]);
  revalidatePath("/app/meditate");
  revalidatePath("/app");
  return { ok: true };
}

export async function createTogether(fd: FormData) {
  const m = await requireMember();
  const title = String(fd.get("title") || "").trim().slice(0, 60) || "一緒に瞑想しませんか";
  const date = String(fd.get("date") || ""), time = String(fd.get("time") || "");
  if (!date || !time) redirect("/app/together?e=" + encodeURIComponent("日にちと時間を入れてください"));
  const startsAt = `${date}T${time}:00+09:00`;
  await q("insert into meisou.together (member_id,title,starts_at,minutes,join_url,note) values ($1,$2,$3,$4,$5,$6)", [
    m.id, title, startsAt, Number(fd.get("minutes") || 15), String(fd.get("join_url") || "").trim(), String(fd.get("note") || "").slice(0, 300)]);
  redirect("/app/together");
}
export async function toggleJoin(fd: FormData) {
  const m = await requireMember();
  const id = String(fd.get("id"));
  const ex = await one("select 1 from meisou.together_joins where together_id=$1 and member_id=$2", [id, m.id]);
  if (ex) await q("delete from meisou.together_joins where together_id=$1 and member_id=$2", [id, m.id]);
  else await q("insert into meisou.together_joins (together_id, member_id) values ($1,$2)", [id, m.id]);
  revalidatePath("/app/together");
}
export async function deleteTogether(fd: FormData) {
  const m = await requireMember();
  await q("delete from meisou.together where id=$1 and (member_id=$2 or $3)", [String(fd.get("id")), m.id, m.is_admin]);
  revalidatePath("/app/together");
}

const SYSTEM = `あなたは瞑想コミュニティ「ひらく瞑想室」のサポート役です。会員から瞑想についての質問や困りごとが届きます。
このコミュニティの考え方：
- まず毎日の瞑想で、情報でいっぱいになった頭を「からっぽ」にする。これが土台。
- その先に、思考の拡張・視座の拡張・抽象度を上げる「拡張型」の瞑想がある。リラックスだけが目的ではない。
- 毎日続けること、仲間と一緒にやることを大切にしている。
答え方のルール：
- 文字の装飾記号（** や # など）は使わない。普通の文章で書く。
- やさしい日本語で、短く。結論を先に。3〜6文程度。必要なら箇条書き3つまで。
- 専門用語はなるべく使わない。今日すぐできる小さな一歩を1つ添える。
- 体や心の不調（強い不安、眠れない日が続く、痛み、過去のつらい記憶がよみがえる等）が関係しそうなときは、無理に続けないよう伝え、医療機関や専門家への相談をすすめる。診断はしない。
- 講座の具体的な内容や、わからないことは推測で断言せず「月1回の思想講座や運営に聞いてみてください」と案内する。`;

export async function askAI(fd: FormData) {
  const m = await requireMember();
  const question = String(fd.get("question") || "").trim().slice(0, 1000);
  if (!question) redirect("/app/ask");
  const cnt = await one<{ c: string }>("select count(*) c from meisou.questions where member_id=$1 and created_at > now() - interval '1 day'", [m.id]);
  if (Number(cnt?.c || 0) >= 20) redirect("/app/ask?e=" + encodeURIComponent("今日の質問は20回までです。また明日どうぞ"));
  let answer = "";
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: process.env.AI_MODEL || "claude-sonnet-4-5",
      max_tokens: 900,
      system: SYSTEM,
      messages: [{ role: "user", content: question }],
    });
    answer = res.content.map((c: any) => (c.type === "text" ? c.text : "")).join("").trim();
  } catch (e: any) {
    console.error("askAI", e?.message);
    redirect("/app/ask?e=" + encodeURIComponent("いまAIが答えられませんでした。少し時間をおいてもう一度どうぞ"));
  }
  await q("insert into meisou.questions (member_id, question, answer) values ($1,$2,$3)", [m.id, question, answer]);
  redirect("/app/ask");
}
