import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCourse } from "@/lib/auth";
import { one } from "@/lib/db";
import { videoEmbed } from "@/lib/embed";

export default async function Lesson({ params }: { params: Promise<{ no: string }> }) {
  await requireCourse();
  const n = Number((await params).no);
  if (!Number.isInteger(n)) notFound();
  const l = await one<any>("select * from meisou.lessons where no=$1", [n]);
  if (!l) notFound();
  const max = await one<{ m: number }>("select max(no) m from meisou.lessons");
  const v = videoEmbed(l.video_url);
  const mats: { label: string; url: string }[] = Array.isArray(l.materials) ? l.materials : [];
  return (
    <div className="narrow" style={{ padding: 0, maxWidth: 820 }}>
      <Link href="/app/course" className="muted">← 講座の一覧</Link>
      <p style={{ marginTop: 16 }}><span className="tag gold">第{l.no}回</span></p>
      <h1 style={{ fontSize: 26 }}>{l.title.replace(/^第\d+回/, "").trim()}</h1>
      {v ? <div className="video">{v.type === "iframe" ? <iframe src={v.src} allowFullScreen allow="autoplay; fullscreen; picture-in-picture" /> : <video src={v.src} controls controlsList="nodownload" />}</div>
        : <div className="card"><p className="muted">動画は準備中です。</p></div>}
      {l.description && <div className="card prose" style={{ marginTop: 16 }}>{l.description}</div>}
      <div className="card" style={{ marginTop: 16 }}>
        <h3>資料</h3>
        {mats.length === 0 ? <p className="muted">この回の資料はまだありません。</p> :
          <ul>{mats.map((x, i) => <li key={i}><a href={x.url} target="_blank" rel="noreferrer">{x.label || "資料"}</a></li>)}</ul>}
      </div>
      <div className="row" style={{ justifyContent: "space-between", marginTop: 20 }}>
        {n > 1 ? <Link className="btn ghost small" href={`/app/course/${n - 1}`}>← 前の回</Link> : <span />}
        {n < (max?.m || 0) ? <Link className="btn small" href={`/app/course/${n + 1}`}>次の回 →</Link> : <span />}
      </div>
      <p className="muted" style={{ marginTop: 20 }}>わからないことは <Link href="/app/ask">AIに質問</Link> できます。</p>
    </div>
  );
}
