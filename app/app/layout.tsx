import Link from "next/link";
import { SITE } from "@/lib/site";
import { requireMember } from "@/lib/auth";
import { logout } from "../actions/auth";

export const dynamic = "force-dynamic";

const NAV = [
  ["/app", "ホーム", "◎"], ["/app/meditate", "瞑想", "○"], ["/app/together", "一緒に", "∞"],
  ["/app/media", "メディア", "□"], ["/app/audio", "音声", "♪"], ["/app/live", "思想講座", "☽"],
  ["/app/course", "動画講座", "▷"], ["/app/ask", "AI質問", "?"],
];

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const m = await requireMember();
  return (
    <div className="has-tabs-wrap">
      <header className="hdr">
        <div className="wrap">
          <Link href="/app" className="logo">{SITE.name}<span>.</span></Link>
          <nav className="nav member">
            {NAV.slice(1).map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}
            {m.is_admin && <Link href="/admin" style={{ color: "var(--gold)" }}>管理</Link>}
            <Link href="/app/account">マイページ</Link>
          </nav>
          <div className="row" style={{ display: "none" }}><form action={logout}><button>ログアウト</button></form></div>
        </div>
      </header>
      <main className="wrap" style={{ paddingTop: 24, paddingBottom: 90 }}>{children}</main>
      <nav className="tabs">
        {[NAV[0], NAV[1], NAV[3], NAV[7]].map(([h, t, i]) => <Link key={h} href={h}><b>{i}</b>{t}</Link>)}
        <Link href="/app/account"><b>≡</b>その他</Link>
      </nav>
    </div>
  );
}
