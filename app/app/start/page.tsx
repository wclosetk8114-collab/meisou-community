import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { SITE } from "@/lib/site";

export default async function Start() {
  const m = await requireMember();
  return (
    <div className="narrow" style={{ padding: 0 }}>
      <div className="page-head" style={{ textAlign: "center" }}>
        <p className="en">Welcome to KUU</p>
        <h1 style={{ fontSize: "clamp(24px,4vw,32px)" }}>{m.name}さん、ようこそ</h1>
        <p className="muted">会員サイトの登録ができました。最後に、オープンチャットに入ってください。</p>
      </div>
      <div className="card flat" style={{ opacity: .7 }}>
        <p className="label"><b>STEP 1</b> 会員サイトに登録</p>
        <p style={{ margin: 0 }}>完了しました</p>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <p className="label"><b>STEP 2</b> 会員向けオープンチャットに入る</p>
        <h2 style={{ fontSize: 20 }}>「KUU-会員向けオプチャ-」</h2>
        <p className="muted">お知らせ・一緒に瞑想の声かけ・思想講座の案内はここで流れます。表示名は「{m.name}」にしてください。</p>
        <a href={SITE.openchat} target="_blank" rel="noreferrer" className="btn noarrow" style={{ background: "#06c755", borderColor: "#06c755", width: "100%" }}>LINEで参加する</a>
      </div>
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Link href="/app/meditate" className="btn">さっそく今日の瞑想をする</Link>
        <p><Link href="/app" className="muted">ホームへ</Link></p>
      </div>
    </div>
  );
}
