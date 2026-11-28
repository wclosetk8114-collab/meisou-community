import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import GuestField from "@/components/GuestField";
import { signupFree } from "../actions/auth";

export default async function JoinFree({ searchParams }: { searchParams: Promise<{ e?: string; next?: string }> }) {
  const { e, next } = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="narrow" style={{ padding: "48px 16px" }}>
        <div className="card">
          <p className="en">FREE</p>
          <h1 style={{ fontSize: 26 }}>無料登録</h1>
          <p className="muted">お金はかかりません。メディアの記事が全部読めて、瞑想の記録と育つ竜もずっと残せます。</p>
          {e && <p className="err">{e}</p>}
          <form action={signupFree}>
            <label>お名前（ニックネームでOK）</label>
            <input name="name" required maxLength={30} />
            <label>メールアドレス</label>
            <input name="email" type="email" required autoComplete="email" />
            <label>パスワード（8文字以上）</label>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" />
            <GuestField />
            <input type="hidden" name="next" value={next && /^\/media\/[0-9a-f-]{36}$/.test(next) ? next : ""} />
            <div className="spacer" />
            <button className="btn gold" style={{ width: "100%" }}>無料ではじめる</button>
          </form>
          <p className="muted" style={{ marginTop: 18 }}>登録ずみの方は <Link href="/login">ログイン</Link>　／　<Link href="/try">登録せずに使う</Link></p>
        </div>
      </main>
    </>
  );
}
