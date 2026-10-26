import Link from "next/link";
import { SITE } from "@/lib/site";
import PublicHeader from "@/components/PublicHeader";
import { login } from "../actions/auth";
import { joinHref } from "@/lib/site";

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="narrow" style={{ padding: "48px 16px" }}>
        <div className="card">
          <p className="en">MEMBER LOGIN</p>
          <h1 style={{ fontSize: 26 }}>ログイン</h1>
          {e && <p className="err">{e}</p>}
          <form action={login}>
            <label>メールアドレス</label>
            <input name="email" type="email" required autoComplete="email" />
            <label>パスワード</label>
            <input name="password" type="password" required autoComplete="current-password" />
            <div className="spacer" />
            <button className="btn" style={{ width: "100%" }}>ログインする</button>
          </form>
          <p className="muted" style={{ marginTop: 18 }}>
            はじめての方は <a href={joinHref()}>会員になる</a>　／　パスワードを忘れたら<a href={SITE.line} target="_blank" rel="noreferrer">KUU公式LINE</a>へ
          </p>
        </div>
      </main>
    </>
  );
}
