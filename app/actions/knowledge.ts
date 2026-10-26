"use server";
import { redirect } from "next/navigation";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { relatedDocs, draftWithAI, importImedia } from "@/lib/knowledge";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const go = (tab: string, msg: string, err = false) => redirect(`/admin?tab=${tab}&${err ? "e" : "ok"}=${encodeURIComponent(msg)}`);

export async function answerWithRefs(fd: FormData) {
  await requireAdmin();
  const refs = fd.getAll("ref").map(String).map((v) => { try { return JSON.parse(v); } catch { return null; } }).filter(Boolean);
  await q("update meisou.questions set answer=$1, answered_at=case when $1='' then null else now() end, is_public=$2, refs=$3 where id=$4",
    [String(fd.get("answer") ?? "").trim(), fd.get("is_public") === "on", JSON.stringify(refs), s(fd, "id")]);
  go("questions", "回答しました");
}
export async function draftQuestion(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const row = await q<any>("select question from meisou.questions where id=$1", [id]);
  if (!row[0]) go("questions", "質問が見つかりません", true);
  let err = "";
  try {
    const docs = await relatedDocs(row[0].question, 5);
    const text = await draftWithAI(row[0].question, docs);
    await q("update meisou.questions set draft=$1 where id=$2", [text, id]);
  } catch (e: any) { err = String(e?.message || e); }
  if (err) go("questions", err, true);
  go("questions", "AIの下書きを入れました。直してから保存してください");
}
export async function syncImedia() {
  await requireAdmin();
  let n = 0, err = "";
  try { n = await importImedia(); } catch (e: any) { err = String(e?.message || e); }
  if (err || !n) go("knowledge", err || "i.mediaの記事を取得できませんでした", true);
  go("knowledge", `i.mediaの記事を${n}本取り込みました`);
}
export async function deleteKnowledge(fd: FormData) {
  await requireAdmin();
  await q("delete from meisou.knowledge where id=$1", [s(fd, "id")]);
  go("knowledge", "削除しました");
}
