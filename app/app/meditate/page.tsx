import Timer from "@/components/Timer";
import { MOODS } from "@/lib/moods";
import { requireMember } from "@/lib/auth";
import { myStats } from "@/lib/stats";
import { q } from "@/lib/db";
import { addChangeNote, deleteChangeNote } from "@/app/actions/member";

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
  const notes = await q<{ id: string; mood: string; body: string; minutes: number | null; d: string }>(
    `select id, mood, body, minutes, to_char(created_at at time zone 'Asia/Tokyo','YYYY.MM.DD HH24:MI') d
     from meisou.change_notes where member_id=$1 order by created_at desc limit 60`, [m.id]);
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
                return <div key={d} className={`d ${s.set.has(d) ? "done" : ""} ${d === s.today ? "today" : ""}`}>{i + 1}</div>;
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

      <div className="card" style={{ marginTop: 18 }} id="notes">
        <p className="label" style={{ marginBottom: 2 }}>My notes</p>
        <h3 style={{ marginTop: 0 }}>わたしの変化ノート</h3>
        <p className="muted" style={{ marginTop: 0 }}>瞑想して気づいたこと、毎日の小さな変化を書きとめる場所です。自分だけに見えます。</p>
        <form action={addChangeNote}>
          <div className="chips" style={{ justifyContent: "flex-start" }}>
            {MOODS.map((x) => (
              <label key={x} className="chip" style={{ cursor: "pointer" }}><input type="radio" name="mood" value={x} style={{ width: "auto", marginRight: 4 }} />{x}</label>
            ))}
          </div>
          <textarea name="body" maxLength={2000} style={{ minHeight: 80 }} placeholder="例：最近、寝る前に考えごとをしなくなってきた" />
          <div className="spacer" />
          <button className="btn small">書きとめる</button>
        </form>
        <div style={{ marginTop: 18 }}>
          {notes.length === 0 && <p className="muted">まだノートはありません。瞑想のあとに、ひとことから書いてみましょう。</p>}
          {notes.map((n) => (
            <div key={n.id} style={{ borderTop: "1px solid var(--line)", padding: "12px 0" }}>
              <div className="row" style={{ justifyContent: "space-between", gap: 8 }}>
                <span className="muted" style={{ fontSize: 12.5 }}>{n.d}{n.minutes ? `　瞑想${n.minutes}分` : ""}</span>
                <form action={deleteChangeNote}><input type="hidden" name="id" value={n.id} /><button className="btn small ghost" style={{ padding: "2px 10px", fontSize: 12 }}>消す</button></form>
              </div>
              {n.mood && <span className="tag gold">{n.mood}</span>}
              {n.body && <p className="prose" style={{ margin: "6px 0 0" }}>{n.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
