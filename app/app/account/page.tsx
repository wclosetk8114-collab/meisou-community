import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { logout, cancelMembership, changePassword } from "@/app/actions/auth";
import { SITE, yen } from "@/lib/site";

export default async function Account({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { e, ok } = await searchParams;
  const m = await requireMember();
  const links = [["/app/meditate", "今日の瞑想"], ["/app/together", "一緒に瞑想"], ["/app/media", "メディア"], ["/app/audio", "音声"],
    ["/app/live", "月1 思想講座"], ["/app/course", "動画講座"], ["/app/qa", "瞑想の質問"]];
  return (
    <div className="narrow" style={{ padding: 0 }}>
      <h1 style={{ fontSize: 28 }}>マイページ</h1>
      {e && <p className="err">{e}</p>}{ok && <p className="ok">{ok}</p>}
      <div className="card">
        <p style={{ margin: 0 }}><b>{m.name}</b>さん<br /><span className="muted">{m.email}</span></p>
        <p className="muted">会員プラン：月額 {yen(SITE.monthly)}（税込）　動画講座：{m.course_access ? "受講中" : "未受講"}</p>
        <div className="row">
          {m.is_admin && <Link href="/admin" className="btn small gold">管理画面</Link>}
          <form action={logout}><button className="btn small ghost">ログアウト</button></form>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>メニュー</h3>
        {links.map(([h, t]) => <p key={h} style={{ margin: "6px 0" }}><Link href={h}>{t}</Link></p>)}
      </div>
      <form action={changePassword} className="card" style={{ marginTop: 16 }}>
        <h3>パスワードを変える</h3>
        <label>今のパスワード</label><input name="current" type="password" required />
        <label>新しいパスワード（8文字以上）</label><input name="next" type="password" required minLength={8} />
        <div className="spacer" /><button className="btn small">変更する</button>
      </form>
      <form action={cancelMembership} className="card" style={{ marginTop: 16 }}>
        <h3>退会する</h3>
        <p className="muted">退会すると、すぐにメディア・音声・講座などの会員ページが見られなくなります。</p>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="confirm" value="yes" style={{ width: "auto" }} /> 退会します</label>
        <div className="spacer" /><button className="btn small danger">退会する</button>
      </form>
    </div>
  );
}
