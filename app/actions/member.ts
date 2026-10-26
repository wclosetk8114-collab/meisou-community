"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { q, one } from "@/lib/db";
import { requireMember } from "@/lib/auth";
import { answerWithAI } from "@/lib/knowledge";

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

export async function askQuestion(fd: FormData) {
  const m = await requireMember();
  const question = String(fd.get("question") || "").trim().slice(0, 1000);
  if (!question) redirect("/app/qa?e=" + encodeURIComponent("質問を書いてください"));
  const cnt = await one<{ c: string }>("select count(*) c from meisou.questions where member_id=$1 and created_at > now() - interval '1 day'", [m.id]);
  if (Number(cnt?.c || 0) >= 5) redirect("/app/qa?e=" + encodeURIComponent("質問は1日5件までです"));
  const row = await one<{ id: string }>("insert into meisou.questions (member_id, question, is_public) values ($1,$2,$3) returning id", [m.id, question, fd.get("is_public") === "on"]);
  let answered = false;
  try {
    const a = await answerWithAI(question);
    if (a.text) {
      await q("update meisou.questions set answer=$1, refs=$2, by_ai=true, answered_at=now() where id=$3", [a.text.replace(/\*\*/g, "").replace(/^#+\s*/gm, ""), JSON.stringify(a.refs), row!.id]);
      answered = true;
    }
  } catch {}
  redirect("/app/qa?ok=" + encodeURIComponent(answered ? "つっちーAIが答えました" : "質問を送りました。回答が来たらここに出ます"));
}

export async function createLineCode() {
  const m = await requireMember();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await q("update meisou.members set line_link_code=$1, line_code_expires=now() + interval '30 minutes' where id=$2", [code, m.id]);
  redirect("/app/account#line");
}
export async function unlinkLine() {
  const m = await requireMember();
  await q("update meisou.members set line_user_id=null, line_link_code=null where id=$1", [m.id]);
  redirect("/app/account?ok=" + encodeURIComponent("LINEとのつながりを解除しました") + "#line");
}
export async function toggleRemind() {
  const m = await requireMember();
  await q("update meisou.members set line_remind = not line_remind where id=$1", [m.id]);
  redirect("/app/account#line");
}
