import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import { videoEmbed } from "@/lib/embed";

export default async function Live() {
  await requireMember();
  const up = await q<any>("select *, to_char(starts_at at time zone 'Asia/Tokyo','YYYY年MM月DD日 HH24:MI') t from meisou.live_sessions where starts_at > now() - interval '3 hours' order by starts_at");
  const past = await q<any>("select *, to_char(starts_at at time zone 'Asia/Tokyo','YYYY.MM.DD') t from meisou.live_sessions where starts_at <= now() - interval '3 hours' order by starts_at desc");
  return (
    <>
      <p className="en">MONTHLY LIVE</p>
      <h1 style={{ fontSize: 28 }}>月1回 思想講座</h1>
      <p className="muted">月に1回、オンラインでリアルタイムに開催します。思考をひろげ、視座を上げ、抽象度を上げる時間です。会員はだれでも参加できます。</p>
      <h2>次回</h2>
      {up.length === 0 && <div className="card"><p className="muted">次回の日程は準備中です。</p></div>}
      {up.map((s: any) => (
        <div className="card" key={s.id} style={{ marginBottom: 12 }}>
          <span className="tag gold">{s.t}〜</span>
          <h3>{s.title}</h3>
          {s.description && <p className="prose">{s.description}</p>}
          {s.join_url ? <a className="btn gold" href={s.join_url} target="_blank" rel="noreferrer">参加する（オンライン）</a>
            : <p className="muted">参加URLは開催前にここに出ます。</p>}
        </div>
      ))}
      <h2>これまでの講座（アーカイブ）</h2>
      {past.length === 0 && <p className="muted">まだありません。</p>}
      <div className="grid">
        {past.map((s: any) => {
          const v = videoEmbed(s.archive_url);
          return (
            <div className="card" key={s.id}>
              <span className="muted">{s.t}</span><h3>{s.title}</h3>
              {v ? (<div className="video">{v.type === "iframe" ? <iframe src={v.src} allowFullScreen /> : <video src={v.src} controls />}</div>)
                : <p className="muted">録画は準備中です。</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}
