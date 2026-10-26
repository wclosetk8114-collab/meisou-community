import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { SITE, yen } from "@/lib/site";
import * as A from "@/app/actions/admin";
import { Questions, Knowledge } from "@/components/AdminQA";

export const dynamic = "force-dynamic";

const TABS = [["members", "会員"], ["posts", "記事・音声"], ["live", "思想講座"], ["lessons", "動画講座"], ["questions", "質問"], ["knowledge", "参考資料"]];

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string; e?: string; ok?: string; edit?: string }> }) {
  await requireAdmin();
  const { tab = "members", e, ok, edit } = await searchParams;
  return (
    <div style={{ background: "#faf9fc", minHeight: "100vh" }}>
      <header className="hdr" style={{ background: "#3b3350" }}>
        <div className="wrap">
          <b className="mincho" style={{ color: "#fff", letterSpacing: ".14em" }}>管理画面</b>
          <nav className="nav">{TABS.map(([k, t]) => <Link key={k} href={`/admin?tab=${k}`} style={{ color: tab === k ? "#e6d3a3" : "#fff" }}>{t}</Link>)}
            <Link href="/app" style={{ color: "#fff" }}>会員サイトへ</Link></nav>
        </div>
      </header>
      <main className="wrap" style={{ padding: "24px 16px 80px" }}>
        {e && <p className="err">{e}</p>}{ok && <p className="ok">{ok}</p>}
        {tab === "members" && <Members />}
        {tab === "posts" && <Posts edit={edit} />}
        {tab === "live" && <Live edit={edit} />}
        {tab === "lessons" && <Lessons />}
        {tab === "questions" && <Questions />}
        {tab === "knowledge" && <Knowledge />}
      </main>
    </div>
  );
}

async function Members() {
  const list = await q<any>(`select m.*, to_char(m.created_at at time zone 'Asia/Tokyo','YYYY/MM/DD') d,
    (select max(day) from meisou.meditation_logs l where l.member_id=m.id) last_day,
    (select count(distinct day) from meisou.meditation_logs l where l.member_id=m.id) days
    from meisou.members m order by m.created_at desc`);
  const active = list.filter((m: any) => m.status === "active").length;
  return (
    <>
      <h2 style={{ marginTop: 0 }}>会員（有効 {active}人 ／ 全{list.length}人）</h2>
      <p className="muted">月の売上の目安：{yen(active * SITE.monthly)}　参加コード（会員登録に必要）は運営設定の SIGNUP_CODE です。</p>
      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>名前 / メール</th><th>状態</th><th>動画講座</th><th>瞑想</th><th>操作</th></tr></thead>
          <tbody>{list.map((m: any) => (
            <tr key={m.id}>
              <td><b>{m.name}</b>{m.is_admin && <span className="tag gold">管理者</span>}<br /><span className="muted">{m.email}<br />登録 {m.d}</span></td>
              <td>{m.status === "active" ? <span className="tag">有効</span> : <span className="tag" style={{ color: "var(--danger)" }}>退会</span>}</td>
              <td>{m.course_access ? "受講中" : "—"}</td>
              <td className="muted">{m.days}日<br />{m.last_day ? `最終 ${new Date(m.last_day).toLocaleDateString("ja-JP")}` : ""}</td>
              <td>
                <div className="row">
                  <Op id={m.id} op={m.status === "active" ? "cancel" : "activate"} label={m.status === "active" ? "退会にする" : "有効に戻す"} />
                  <Op id={m.id} op={m.course_access ? "course_off" : "course_on"} label={m.course_access ? "講座を閉じる" : "講座を開く"} />
                </div>
                <form action={A.setMember} className="row" style={{ marginTop: 6 }}>
                  <input type="hidden" name="id" value={m.id} /><input type="hidden" name="op" value="reset" />
                  <input name="pw" placeholder="新しい仮パスワード" style={{ width: 150, padding: 6, fontSize: 13 }} />
                  <button className="btn small ghost">PW変更</button>
                </form>
              </td>
            </tr>))}</tbody>
        </table>
      </div>
      <form action={A.addMember} className="card" style={{ marginTop: 16, maxWidth: 520 }}>
        <h3>会員を手で追加する</h3>
        <label>名前</label><input name="name" required />
        <label>メール</label><input name="email" type="email" required />
        <label>仮パスワード（8文字以上・本人に伝える）</label><input name="pw" required minLength={8} />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="course" style={{ width: "auto" }} /> 動画講座も開く</label>
        <div className="spacer" /><button className="btn small">追加する</button>
      </form>
    </>
  );
}
function Op({ id, op, label }: { id: string; op: string; label: string }) {
  return <form action={A.setMember}><input type="hidden" name="id" value={id} /><input type="hidden" name="op" value={op} /><button className="btn small ghost">{label}</button></form>;
}

async function Posts({ edit }: { edit?: string }) {
  const list = await q<any>("select *, to_char(created_at at time zone 'Asia/Tokyo','YYYY/MM/DD') d from meisou.posts order by created_at desc");
  const cur = list.find((p: any) => p.id === edit);
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", alignItems: "start" }}>
      <form action={A.savePost} className="card" key={cur?.id || "new"}>
        <h3>{cur ? "記事・音声を直す" : "記事・音声を投稿する"}</h3>
        <input type="hidden" name="id" value={cur?.id || ""} />
        <label>種類</label>
        <select name="kind" defaultValue={cur?.kind || "article"}><option value="article">メディア記事</option><option value="audio">音声</option></select>
        <label>タイトル</label><input name="title" defaultValue={cur?.title} required />
        <label>音声のURL（音声のとき。Googleドライブの共有リンク・mp3のURL・YouTubeなど）</label>
        <input name="media_url" defaultValue={cur?.media_url} placeholder="https://" />
        <label>本文（記事のとき。音声なら説明）</label><textarea name="body" defaultValue={cur?.body} style={{ minHeight: 220 }} />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="published" defaultChecked={cur ? cur.published : true} style={{ width: "auto" }} /> 公開する</label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="notify" defaultChecked={!cur} style={{ width: "auto" }} /> 保存したら、会員にLINEで知らせる</label>
        <div className="spacer" /><button className="btn small">保存する</button> {cur && <Link href="/admin?tab=posts" className="muted">新規にもどる</Link>}
      </form>
      <div className="card">
        <h3>投稿一覧</h3>
        <table><tbody>{list.map((p: any) => (
          <tr key={p.id}><td><b>{p.title}</b><br /><span className="muted">{p.d} {p.published ? "" : "（非公開）"}</span></td>
            <td><div className="row"><Link className="btn small ghost" href={`/admin?tab=posts&edit=${p.id}`}>直す</Link>
              <form action={A.deletePost}><input type="hidden" name="id" value={p.id} /><button className="btn small ghost">削除</button></form></div></td></tr>))}</tbody></table>
      </div>
    </div>
  );
}

async function Live({ edit }: { edit?: string }) {
  const list = await q<any>("select *, to_char(starts_at at time zone 'Asia/Tokyo','YYYY-MM-DD') dd, to_char(starts_at at time zone 'Asia/Tokyo','HH24:MI') tt from meisou.live_sessions order by starts_at desc");
  const cur = list.find((p: any) => p.id === edit);
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", alignItems: "start" }}>
      <form action={A.saveLive} className="card" key={cur?.id || "new"}>
        <h3>{cur ? "思想講座を直す" : "思想講座を追加する"}</h3>
        <input type="hidden" name="id" value={cur?.id || ""} />
        <label>タイトル</label><input name="title" defaultValue={cur?.title} placeholder="月1 思想講座（第2回）" />
        <div className="row"><div style={{ flex: 1 }}><label>日にち</label><input name="date" type="date" defaultValue={cur?.dd} required /></div>
          <div style={{ flex: 1 }}><label>開始時間</label><input name="time" type="time" defaultValue={cur?.tt || "20:00"} /></div></div>
        <label>参加URL（Zoom など）</label><input name="join_url" defaultValue={cur?.join_url} placeholder="https://" />
        <label>録画URL（終わったら。YouTube限定公開・Vimeo・Googleドライブ）</label><input name="archive_url" defaultValue={cur?.archive_url} placeholder="https://" />
        <label>説明</label><textarea name="description" defaultValue={cur?.description} />
        <div className="spacer" /><button className="btn small">保存する</button> {cur && <Link href="/admin?tab=live" className="muted">新規にもどる</Link>}
      </form>
      <div className="card"><h3>一覧</h3>
        <table><tbody>{list.map((p: any) => (
          <tr key={p.id}><td><b>{p.title}</b><br /><span className="muted">{p.dd} {p.tt}　{p.archive_url ? "録画あり" : ""}</span></td>
            <td><div className="row"><Link className="btn small ghost" href={`/admin?tab=live&edit=${p.id}`}>直す</Link>
              <form action={A.deleteLive}><input type="hidden" name="id" value={p.id} /><button className="btn small ghost">削除</button></form></div></td></tr>))}</tbody></table>
      </div>
    </div>
  );
}

async function Lessons() {
  const list = await q<any>("select * from meisou.lessons order by no");
  return (
    <>
      <h2 style={{ marginTop: 0 }}>動画講座（{yen(SITE.course)}・税別）</h2>
      <p className="muted">動画はYouTube（限定公開）・Vimeo・Googleドライブの共有リンクを貼るだけで見られます。資料は1行に「資料名 URL」で書いてください。</p>
      {list.map((l: any) => (
        <form action={A.saveLesson} key={l.id} className="card" style={{ marginBottom: 14 }}>
          <input type="hidden" name="id" value={l.id} />
          <span className="tag gold">第{l.no}回</span>
          <label>タイトル</label><input name="title" defaultValue={l.title} />
          <label>動画URL</label><input name="video_url" defaultValue={l.video_url} placeholder="https://" />
          <label>説明</label><textarea name="description" defaultValue={l.description} style={{ minHeight: 70 }} />
          <label>資料（1行に1つ「資料名 URL」）</label>
          <textarea name="materials" style={{ minHeight: 70 }} defaultValue={(l.materials || []).map((m: any) => `${m.label} ${m.url}`).join("\n")} placeholder="第1回スライド https://drive.google.com/..." />
          <div className="spacer" /><button className="btn small">第{l.no}回を保存</button>
        </form>
      ))}
    </>
  );
}
