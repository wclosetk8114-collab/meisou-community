import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import Banner from "@/components/Banner";
import { one } from "@/lib/db";
import { currentMember } from "@/lib/auth";
import { audioEmbed } from "@/lib/embed";

export const dynamic = "force-dynamic";
const PREVIEW = 400; // 登録なしで読める文字数

export default async function PublicArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const p = await one<any>("select *, to_char(created_at at time zone 'Asia/Tokyo','YYYY.MM.DD') d from meisou.posts where id=$1 and published and kind in ('article','radio')", [id]);
  if (!p) notFound();
  const m = await currentMember();
  const full = !!m && (m.status === "active" || m.status === "free" || m.is_admin);
  const body = String(p.body || "");
  const cut = !full && body.length > PREVIEW;
  const a = audioEmbed(p.media_url);
  return (
    <>
      <PublicHeader />
      <article className="narrow" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <Link href="/media" className="muted">← メディア一覧</Link>
        <div style={{ marginTop: 16 }}><Banner id={p.id} title={p.title} image={p.image_url} /></div>
        <p className="muted" style={{ marginTop: 20 }}>{p.d}</p>
        {p.kind === "radio" && <span className="tag gold" style={{ fontSize: 12 }}>つっちーのラジオ</span>}
        <h1 style={{ fontSize: 28 }}>{p.title}</h1>
        {a && (a.type === "audio" ? <audio controls src={a.src} style={{ width: "100%" }} /> : <iframe src={a.src} style={{ width: "100%", height: a.src.includes("stand.fm") ? 190 : 120, border: 0, borderRadius: 12 }} allow="autoplay" />)}
        {p.kind === "radio" && <p className="label" style={{ marginTop: 20 }}>まとめ記事</p>}
        <div className={`card prose ${cut ? "fadeout" : ""}`} style={{ marginTop: p.kind === "radio" ? 6 : 16 }}>{cut ? body.slice(0, PREVIEW) + "…" : body}</div>
        {cut && (
          <div className="card" style={{ textAlign: "center", marginTop: 14 }}>
            <h3 style={{ marginTop: 0 }}>続きは、無料登録で読めます</h3>
            <p className="muted">名前とメールアドレスだけ。お金はかかりません。</p>
            <Link href={`/join-free?next=/media/${p.id}`} className="btn gold">無料登録して続きを読む</Link>
            <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>登録ずみの方は <Link href="/login">ログイン</Link></p>
          </div>
        )}
      </article>
    </>
  );
}
