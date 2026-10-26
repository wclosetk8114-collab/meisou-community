import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { getPaidSession } from "@/lib/stripe";
import { one } from "@/lib/db";
import { signup } from "../actions/auth";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function Welcome({ searchParams }: { searchParams: Promise<{ session_id?: string; e?: string }> }) {
  const { session_id = "", e } = await searchParams;
  const paid = await getPaidSession(session_id);
  const used = paid ? await one("select id from meisou.members where stripe_session_id=$1", [paid.id]) : null;
  return (
    <>
      <PublicHeader />
      <main className="narrow" style={{ padding: "48px 20px 80px" }}>
        {!paid ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p className="en">Thank you</p>
            <h1 style={{ fontSize: 24 }}>決済を確認できませんでした</h1>
            <p className="muted">決済が終わったあとの画面から開き直してください。うまくいかないときは、運営までご連絡ください。</p>
            <Link href="/login" className="btn ghost noarrow">ログインへ</Link>
          </div>
        ) : used ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p className="en">Welcome</p>
            <h1 style={{ fontSize: 24 }}>登録はもう済んでいます</h1>
            <p className="muted">登録したメールアドレスとパスワードでログインしてください。</p>
            <Link href="/login" className="btn">ログインする</Link>
          </div>
        ) : (
          <>
            <p className="en" style={{ textAlign: "center" }}>Welcome to KUU</p>
            <h1 style={{ textAlign: "center", fontSize: "clamp(24px,4vw,32px)" }}>お申し込み、ありがとうございます</h1>
            <p className="muted" style={{ textAlign: "center" }}>決済が完了しました。あと2つで、はじめられます。</p>
            <div className="card" style={{ marginTop: 24 }}>
              <p className="label"><b>STEP 1</b> 会員サイトに登録</p>
              <h2 style={{ fontSize: 20 }}>ログイン用のパスワードを決めてください</h2>
              {e && <p className="err">{e}</p>}
              <form action={signup}>
                <input type="hidden" name="session_id" value={paid.id} />
                <label>お名前（ニックネーム可・コミュニティに表示されます）</label>
                <input name="name" required maxLength={30} defaultValue={paid.name} />
                <label>メールアドレス</label>
                <input name="email" type="email" required defaultValue={paid.email} />
                <label>パスワード（8文字以上）</label>
                <input name="password" type="password" required minLength={8} autoComplete="new-password" />
                <div className="spacer" />
                <button className="btn" style={{ width: "100%" }}>登録して、次へ</button>
              </form>
            </div>
            <div className="card flat lock" style={{ marginTop: 16 }}>
              <p className="label"><b>STEP 2</b> 会員向けオープンチャットに入る</p>
              <p className="muted" style={{ margin: 0 }}>登録が終わると、参加ボタンが出ます。</p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
