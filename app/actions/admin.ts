"use server";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const done = (tab: string, msg = "保存しました") => redirect(`/admin?tab=${tab}&ok=${encodeURIComponent(msg)}`);

export async function setMember(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id"), op = s(fd, "op");
  if (op === "cancel") await q("update meisou.members set status='canceled', canceled_at=now() where id=$1", [id]);
  if (op === "activate") await q("update meisou.members set status='active', canceled_at=null where id=$1", [id]);
  if (op === "course_on") await q("update meisou.members set course_access=true where id=$1", [id]);
  if (op === "course_off") await q("update meisou.members set course_access=false where id=$1", [id]);
  if (op === "reset") {
    const pw = s(fd, "pw");
    if (pw.length < 8) redirect(`/admin?tab=members&e=${encodeURIComponent("仮パスワードは8文字以上にしてください")}`);
    await q("update meisou.members set password_hash=$1 where id=$2", [await bcrypt.hash(pw, 10), id]);
    done("members", "パスワードを変えました。本人に伝えてください");
  }
  revalidatePath("/admin");
  done("members");
}
export async function addMember(fd: FormData) {
  await requireAdmin();
  const email = s(fd, "email").toLowerCase(), name = s(fd, "name"), pw = s(fd, "pw");
  if (!email || !name || pw.length < 8) redirect(`/admin?tab=members&e=${encodeURIComponent("名前・メール・8文字以上の仮パスワードを入れてください")}`);
  try {
    await q("insert into meisou.members (email,password_hash,name,course_access) values ($1,$2,$3,$4)",
      [email, await bcrypt.hash(pw, 10), name, fd.get("course") === "on"]);
  } catch { redirect(`/admin?tab=members&e=${encodeURIComponent("このメールはすでに登録されています")}`); }
  done("members", "会員を追加しました");
}
export async function savePost(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const vals = [s(fd, "kind") === "audio" ? "audio" : "article", s(fd, "title"), String(fd.get("body") ?? ""), s(fd, "media_url"), fd.get("published") === "on"];
  if (!vals[1]) redirect(`/admin?tab=posts&e=${encodeURIComponent("タイトルを入れてください")}`);
  if (id) await q("update meisou.posts set kind=$1,title=$2,body=$3,media_url=$4,published=$5 where id=$6", [...vals, id]);
  else await q("insert into meisou.posts (kind,title,body,media_url,published) values ($1,$2,$3,$4,$5)", vals);
  done("posts");
}
export async function deletePost(fd: FormData) {
  await requireAdmin();
  await q("delete from meisou.posts where id=$1", [s(fd, "id")]);
  done("posts", "削除しました");
}
export async function saveLive(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const startsAt = `${s(fd, "date")}T${s(fd, "time") || "20:00"}:00+09:00`;
  const vals = [s(fd, "title") || "月1 思想講座", startsAt, s(fd, "join_url"), s(fd, "archive_url"), String(fd.get("description") ?? "")];
  if (id) await q("update meisou.live_sessions set title=$1,starts_at=$2,join_url=$3,archive_url=$4,description=$5 where id=$6", [...vals, id]);
  else await q("insert into meisou.live_sessions (title,starts_at,join_url,archive_url,description) values ($1,$2,$3,$4,$5)", vals);
  done("live");
}
export async function deleteLive(fd: FormData) {
  await requireAdmin();
  await q("delete from meisou.live_sessions where id=$1", [s(fd, "id")]);
  done("live", "削除しました");
}
export async function saveLesson(fd: FormData) {
  await requireAdmin();
  const mats = String(fd.get("materials") ?? "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.match(/^(.*?)[\s|｜]+(https?:\/\/\S+)$/);
    return m ? { label: m[1].trim(), url: m[2] } : { label: "資料", url: l };
  });
  await q("update meisou.lessons set title=$1, description=$2, video_url=$3, materials=$4 where id=$5",
    [s(fd, "title"), String(fd.get("description") ?? ""), s(fd, "video_url"), JSON.stringify(mats), s(fd, "id")]);
  done("lessons");
}
export async function answerQuestion(fd: FormData) {
  await requireAdmin();
  await q("update meisou.questions set answer=$1, answered_at=case when $1='' then null else now() end, is_public=$2 where id=$3",
    [String(fd.get("answer") ?? "").trim(), fd.get("is_public") === "on", s(fd, "id")]);
  done("questions", "回答しました");
}
export async function deleteQuestion(fd: FormData) {
  await requireAdmin();
  await q("delete from meisou.questions where id=$1", [s(fd, "id")]);
  done("questions", "削除しました");
}
