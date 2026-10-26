import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { myStats } from "@/lib/stats";
import { q, one } from "@/lib/db";

export default async function AppHome() {
  const m = await requireMember();
  const s = await myStats(m.id);
  const live = await one<{ title: string; d: string; t: string }>(
    "select title, to_char(starts_at at time zone 'Asia/Tokyo','MM.DD') d, to_char(starts_at at time zone 'Asia/Tokyo','HH24:MI') t from meisou.live_sessions where starts_at > now() - interval '3 hours' order by starts_at limit 1");
  const posts = await q<{ id: string; kind: string; title: string; d: string }>(
    "select id, kind, title, to_char(created_at at time zone 'Asia/Tokyo','MM.DD') d from meisou.posts where published order by created_at desc limit 4");
  const tg = await q<{ title: string; t: string; name: string }>(
    `select t.title, to_char(t.starts_at at time zone 'Asia/Tokyo','MM.DD HH24:MI') t, mb.name from meisou.together t join meisou.members mb on mb.id=t.member_id
     where t.starts_at > now() - interval '30 minutes' order by t.starts_at limit 3`);
  const todayCount = await one<{ c: string }>("select count(distinct member_id) c from meisou.meditation_logs where day=(now() at time zone 'Asia/Tokyo')::date");
  return (
    <>
      <div className="page-head">
        <p className="en">Welcome back</p>
        <h1 style={{ fontSize: "clamp(24px,4vw,34px)" }}>{m.name}さん</h1>
      </div>
      <div className="card today-card">
        <div className="mini" />
        <div>
          <p className="label" style={{ marginBottom: 4 }}>Today</p>
          {s.doneToday ? (
            <><h2 style={{ margin: 0 }}>今日の瞑想、できました</h2>
              <p className="muted">{s.streak}日連続。明日もまた、ここで。</p>
              <Link href="/app/meditate" className="btn ghost small">記録を見る</Link></>
          ) : (
            <><h2 style={{ margin: 0 }}>{s.streak > 0 ? `今日で${s.streak + 1}日目` : "まずは5分から"}</h2>
              <p className="muted">今日は{todayCount?.c || 0}人が瞑想しました。</p>
              <Link href="/app/meditate" className="btn">瞑想をはじめる</Link></>
          )}
        </div>
      </div>
      <div className="grid" style={{ marginTop: 18, gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        <div className="card flat" style={{ textAlign: "center", padding: 20 }}><div className="num">{s.streak}</div><span className="muted">日連続</span></div>
        <div className="card flat" style={{ textAlign: "center", padding: 20 }}><div className="num">{s.totalDays}</div><span className="muted">日やった</span></div>
        <div className="card flat" style={{ textAlign: "center", padding: 20 }}><div className="num">{s.totalMin}</div><span className="muted">分の合計</span></div>
      </div>
      <a href={SITE.openchat} target="_blank" rel="noreferrer" className="card row" style={{ justifyContent: "space-between", marginTop: 18, textDecoration: "none", color: "inherit" }}>
        <div><p className="label" style={{ marginBottom: 2 }}>Open chat</p><h3 style={{ margin: 0 }}>会員向けオープンチャット</h3><span className="muted">KUUの会員だけが入れるLINEのオープンチャットです</span></div>
        <span className="btn small" style={{ background: "#06c755", borderColor: "#06c755" }}>LINEで参加する</span>
      </a>
      <div className="grid" style={{ marginTop: 18 }}>
        <Link href="/app/live" className="card" style={{ textDecoration: "none", color: "inherit" }}>
          <p className="label">Monthly live</p>
          {live ? <><div className="num" style={{ fontSize: 38 }}>{live.d}<span className="muted" style={{ fontSize: 15, marginLeft: 10 }}>{live.t}〜</span></div><h3>{live.title}</h3></>
            : <p className="muted">次回の日程は準備中です</p>}
          <span className="muted">思想講座をひらく →</span>
        </Link>
        <Link href="/app/together" className="card" style={{ textDecoration: "none", color: "inherit" }}>
          <p className="label">Together</p>
          {tg.length === 0 ? <><h3>一緒に瞑想する人を募集</h3><p className="muted">まだ募集はありません。最初の募集をしてみませんか。</p></> :
            tg.map((x, i) => <p key={i} style={{ margin: "8px 0" }}><span className="tag gold">{x.t}</span> {x.title}</p>)}
          <span className="muted">募集を見る →</span>
        </Link>
        <Link href="/app/qa" className="card" style={{ textDecoration: "none", color: "inherit", display: "flex", gap: 14, alignItems: "center" }}>
          <img src="/tsuchii.jpg" alt="" width={56} height={56} style={{ borderRadius: "50%", border: "1px solid var(--gold-l)" }} />
          <div><p className="label" style={{ marginBottom: 2 }}>Q &amp; A</p><h3 style={{ margin: 0 }}>瞑想で困ったら、つっちーに質問</h3></div>
        </Link>
        <div className="card">
          <p className="label">New</p>
          {posts.map((p) => (
            <Link key={p.id} className="list-link" href={p.kind === "audio" ? "/app/audio" : `/app/media/${p.id}`}>
              <span><span className="muted" style={{ marginRight: 10 }}>{p.d}</span>{p.kind === "audio" && <span className="tag" style={{ marginRight: 6 }}>音声</span>}{p.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
