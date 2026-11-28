import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SITE, yen, joinHref } from "@/lib/site";
import { logout } from "@/app/actions/auth";

export default async function Upgrade() {
  const m = await requireUser();
  return (
    <div className="narrow" style={{ padding: 0 }}>
      <p className="en">MEMBERSHIP</p>
      <h1 style={{ fontSize: 28 }}>ここから先は、くう会員のページです</h1>
      <div className="card" style={{ textAlign: "center" }}>
        <p className="muted">一緒に瞑想・会員だけの音声・月1思想講座・つっちーAIへの質問・会員オープンチャット</p>
        <p className="price">{yen(SITE.monthly)}<small>／月（税込）</small></p>
        <p><span className="tag gold">最初の1ヶ月は無料</span></p>
        <a href={joinHref()} className="btn gold">初月無料で会員になる</a>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>いまの記録と竜は、そのまま引きつがれます（同じメールアドレスで登録してください）。</p>
      </div>
      <div className="row" style={{ marginTop: 18, justifyContent: "space-between" }}>
        <Link href="/app/meditate" className="btn ghost small">瞑想にもどる</Link>
        {m.status === "free" && <form action={logout}><button className="btn ghost small">ログアウト</button></form>}
      </div>
    </div>
  );
}
