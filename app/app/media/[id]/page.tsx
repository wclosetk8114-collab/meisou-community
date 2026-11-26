import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth";
import { one } from "@/lib/db";
import { audioEmbed } from "@/lib/embed";
import Banner from "@/components/Banner";

export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  await requireMember();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const p = await one<any>("select *, to_char(created_at at time zone 'Asia/Tokyo','YYYY.MM.DD') d from meisou.posts where id=$1 and published", [id]);
  if (!p) notFound();
  const a = audioEmbed(p.media_url);
  return (
    <article className="narrow" style={{ padding: 0 }}>
      <Link href="/app/media" className="muted">← メディア一覧</Link>
      <div style={{ marginTop: 16 }}><Banner id={p.id} title={p.title} image={p.image_url} /></div>
      <p className="muted" style={{ marginTop: 20 }}>{p.d}</p>
      {p.kind === "radio" && <span className="tag gold" style={{ fontSize: 12 }}>つっちーのラジオ</span>}
      <h1 style={{ fontSize: 28 }}>{p.title}</h1>
      {a && (a.type === "audio" ? <audio controls src={a.src} style={{ width: "100%" }} /> : <iframe src={a.src} style={{ width: "100%", height: a.src.includes("stand.fm") ? 190 : 120, border: 0, borderRadius: 12 }} allow="autoplay" />)}
      {p.kind === "radio" && <p className="label" style={{ marginTop: 20 }}>まとめ記事</p>}
      <div className="card prose" style={{ marginTop: p.kind === "radio" ? 6 : 16 }}>{p.body}</div>
    </article>
  );
}
