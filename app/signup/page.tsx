import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { signup } from "../actions/auth";
import { SITE, yen } from "@/lib/site";

export default async function Signup({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="narrow" style={{ padding: "48px 16px" }}>
        <div className="card">
          <p className="en">JOIN</p>
          <h1 style={{ fontSize: 26 }}>会員登録</h1>
          <p className="muted">初月無料・期間限定 月額 {yen(SITE.monthly)}（税込）。お申し込み後にお送りする「参加コード」を入れてください。</p>
          {e && <p className="err">{e}</p>}
          <form action={signup}>
            <label>お名前（ニックネーム可・コミュニティに表示されます）</label>
            <input name="name" required maxLength={30} />
            <label>メールアドレス</label>
            <input name="email" type="email" required autoComplete="email" />
            <label>パスワード（8文字以上）</label>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" />
            <label>参加コード</label>
            <input name="code" required />
            <div className="spacer" />
            <button className="btn gold" style={{ width: "100%" }}>登録してはじめる</button>
          </form>
          <p className="muted" style={{ marginTop: 18 }}>すでに会員の方は <Link href="/login">ログイン</Link></p>
        </div>
      </main>
    </>
  );
}
