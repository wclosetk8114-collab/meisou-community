import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { logout } from "../actions/auth";

export default function Left() {
  return (
    <>
      <PublicHeader />
      <main className="narrow" style={{ padding: "60px 16px", textAlign: "center" }}>
        <div className="card">
          <p className="en">THANK YOU</p>
          <h1 style={{ fontSize: 24 }}>退会済みのアカウントです</h1>
          <p>これまでありがとうございました。<br />退会後は、メディア・音声・講座などの会員ページは見られません。</p>
          <p className="muted">また始めたくなったら、いつでも運営までご連絡ください。</p>
          <div className="row" style={{ justifyContent: "center", marginTop: 20 }}>
            <Link className="btn ghost" href="/">トップへ</Link>
            <form action={logout}><button className="btn small ghost">ログアウト</button></form>
          </div>
        </div>
      </main>
    </>
  );
}
