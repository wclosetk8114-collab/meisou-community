import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { myStats } from "@/lib/stats";
import { q, one } from "@/lib/db";

export default async function AppHome() {
  const m = await requireMember();
  const s = await myStats(m.id);
  const live = await one<{ title: string; t: string }>(
    "select title, to_char(starts_at at time zone 'Asia/Tokyo','MM月DD日 HH24:MI') t from meisou.live_sessions where starts_at > now() - interval '3 hours' order by starts_at limit 1");
  const posts = await q<{ id: string; kind: string; title: string; d: string }>(
    "select id, kind, title, to_char(created_at at time zone 'Asia/Tokyo','MM/DD') d from meisou.posts where published order by created_at desc limit 4");
  const tg = await q<{ title: string; t: string; name: string }>(
    `select t.title, to_char(t.starts_at at time zone 'Asia/Tokyo','MM/DD HH24:MI') t, mb.name from meisou.together t join meisou.members mb on mb.id=t.member_id
     where t.starts_at > now() - interval '30 minutes' order by t.starts_at limit 3`);
  return (
    <>
      <p className="en">WELCOME</p>
      <h1 style={{ fontSize: 28 }}>{m.name}さん、こんにちは</h1>
      <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg,#fff,#f1eaf9)" }}>
        {s.doneToday ? (
          <><p className="mincho" style={{ fontSize: 20, margin: 0 }}>今日の瞑想、できました</p>
            <p className="muted">{s.streak}日連続です。明日もまた。</p></>
        ) : (
          <><p className="mincho" style={{ fontSize: 20, margin: 0 }}>今日はまだです</p>
            <p className="muted">{s.streak > 0 ? `${s.streak}日連続中。今日で${s.streak + 1}日目。` : "5分だけでも大丈夫です。"}</p>
            <Link href="/app/meditate" className="btn">瞑想をはじめる</Link></>
        )}
      </div>
      <div className="spacer" />
      <div className="grid">
        <div className="card">
          <span className="tag gold">月1 思想講座</span>
          {live ? <><h3>{live.title}</h3><p className="muted">{live.t}〜</p></> : <p className="muted">次回の日程は準備中です</p>}
          <Link href="/app/live">くわしく →</Link>
        </div>
        <div className="card">
          <span className="tag">一緒に瞑想</span>
          {tg.length === 0 ? <p className="muted">募集はまだありません</p> :
            tg.map((x, i) => <p key={i} style={{ margin: "6px 0" }}>{x.t}　{x.title}<br /><span className="muted">{x.name}さん</span></p>)}
          <Link href="/app/together">募集を見る・つくる →</Link>
        </div>
        <div className="card">
          <span className="tag">新着</span>
          {posts.map((p) => (
            <p key={p.id} style={{ margin: "6px 0" }}>
              <Link href={p.kind === "audio" ? "/app/audio" : `/app/media/${p.id}`}>{p.kind === "audio" ? "♪ " : ""}{p.title}</Link> <span className="muted">{p.d}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="spacer" />
      <div className="card row" style={{ justifyContent: "space-between" }}>
        <div><b>瞑想で困ったら</b><br /><span className="muted">AIがいつでも答えます</span></div>
        <Link href="/app/ask" className="btn ghost small">AIに質問する</Link>
      </div>
    </>
  );
}
