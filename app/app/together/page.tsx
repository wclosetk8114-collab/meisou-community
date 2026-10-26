import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import { createTogether, toggleJoin, deleteTogether } from "@/app/actions/member";

export default async function Together({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const m = await requireMember();
  const list = await q<any>(
    `select t.*, mb.name, to_char(t.starts_at at time zone 'Asia/Tokyo','MM月DD日 HH24:MI') t_label,
      (select count(*) from meisou.together_joins j where j.together_id=t.id) joins,
      exists(select 1 from meisou.together_joins j where j.together_id=t.id and j.member_id=$1) joined,
      (select string_agg(m2.name, '・') from meisou.together_joins j join meisou.members m2 on m2.id=j.member_id where j.together_id=t.id) joiners
     from meisou.together t join meisou.members mb on mb.id=t.member_id
     where t.starts_at > now() - interval '1 hour' order by t.starts_at`, [m.id]);
  return (
    <>
      <h1 style={{ fontSize: 28 }}>一緒に瞑想</h1>
      <p className="muted">「この時間にやります」と募集すると、同じ時間にみんなで瞑想できます。ZoomやGoogle MeetのURLを入れると、そのままつながれます。</p>
      <div className="grid" style={{ alignItems: "start" }}>
        <div>
          {list.length === 0 && <div className="card"><p className="muted">いまは募集がありません。最初の募集をしてみませんか。</p></div>}
          {list.map((t: any) => (
            <div className="card" key={t.id} style={{ marginBottom: 12 }}>
              <span className="tag gold">{t.t_label}〜 {t.minutes}分</span>
              <h3>{t.title}</h3>
              <p className="muted" style={{ margin: 0 }}>募集：{t.name}さん　参加：{t.joins}人{t.joiners ? `（${t.joiners}）` : ""}</p>
              {t.note && <p className="prose">{t.note}</p>}
              <div className="row" style={{ marginTop: 10 }}>
                <form action={toggleJoin}><input type="hidden" name="id" value={t.id} />
                  <button className={`btn small ${t.joined ? "ghost" : ""}`}>{t.joined ? "参加をやめる" : "参加する"}</button></form>
                {t.join_url && <a className="btn small gold" href={t.join_url} target="_blank" rel="noreferrer">入室する</a>}
                {(t.member_id === m.id || m.is_admin) && (
                  <form action={deleteTogether}><input type="hidden" name="id" value={t.id} /><button className="btn small ghost">消す</button></form>)}
              </div>
            </div>
          ))}
        </div>
        <form action={createTogether} className="card">
          <h3>募集する</h3>
          {e && <p className="err">{e}</p>}
          <label>タイトル</label><input name="title" placeholder="朝6時の15分瞑想" maxLength={60} />
          <div className="row"><div style={{ flex: 1 }}><label>日にち</label><input name="date" type="date" required /></div>
            <div style={{ flex: 1 }}><label>時間</label><input name="time" type="time" required /></div></div>
          <label>長さ</label>
          <select name="minutes" defaultValue="15">{[5, 10, 15, 20, 30, 45, 60].map((n) => <option key={n} value={n}>{n}分</option>)}</select>
          <label>ZoomやMeetのURL（なくてもOK）</label><input name="join_url" type="url" placeholder="https://" />
          <label>ひとこと</label><textarea name="note" maxLength={300} style={{ minHeight: 70 }} />
          <div className="spacer" /><button className="btn" style={{ width: "100%" }}>募集を出す</button>
        </form>
      </div>
    </>
  );
}
