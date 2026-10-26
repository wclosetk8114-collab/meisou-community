import Timer from "@/components/Timer";
import { requireMember } from "@/lib/auth";
import { myStats } from "@/lib/stats";
import { q } from "@/lib/db";

export default async function Meditate() {
  const m = await requireMember();
  const s = await myStats(m.id);
  const [y, mo] = s.today.split("-").map(Number);
  const first = new Date(Date.UTC(y, mo - 1, 1));
  const daysIn = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const pad = first.getUTCDay();
  const feed = await q<{ name: string; minutes: number; note: string; t: string }>(
    `select mb.name, l.minutes, l.note, to_char(l.created_at at time zone 'Asia/Tokyo','HH24:MI') t
     from meisou.meditation_logs l join meisou.members mb on mb.id=l.member_id
     where l.day=(now() at time zone 'Asia/Tokyo')::date order by l.created_at desc limit 50`);
  return (
    <>
      <h1 style={{ fontSize: 28 }}>今日の瞑想</h1>
      <div className="grid" style={{ alignItems: "start" }}>
        <Timer />
        <div>
          <div className="card">
            <div className="row" style={{ justifyContent: "space-around", textAlign: "center" }}>
              <div><div className="price">{s.streak}</div><span className="muted">日連続</span></div>
              <div><div className="price">{s.totalDays}</div><span className="muted">日やった</span></div>
              <div><div className="price">{s.totalMin}</div><span className="muted">分合計</span></div>
            </div>
            <div className="line" style={{ margin: "16px 0" }} />
            <p className="muted" style={{ margin: "0 0 8px" }}>{mo}月の記録</p>
            <div className="cal">
              {["日", "月", "火", "水", "木", "金", "土"].map((d) => <div key={d} style={{ background: "none" }}>{d}</div>)}
              {Array.from({ length: pad }).map((_, i) => <div key={"p" + i} style={{ background: "none" }} />)}
              {Array.from({ length: daysIn }).map((_, i) => {
                const d = `${y}-${String(mo).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                return <div key={d} className={`${s.set.has(d) ? "done" : ""} ${d === s.today ? "today" : ""}`}>{i + 1}</div>;
              })}
            </div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <h3>今日瞑想した人（{new Set(feed.map((f) => f.name)).size}人）</h3>
            <div className="feed">
              {feed.length === 0 && <p className="muted">まだだれもいません。一番乗りしませんか。</p>}
              {feed.map((f, i) => (
                <div key={i}><b>{f.name}</b> <span className="tag">{f.minutes}分</span> <span className="muted">{f.t}</span>
                  {f.note && <div>{f.note}</div>}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
