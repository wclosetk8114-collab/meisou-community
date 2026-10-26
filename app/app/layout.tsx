import Link from "next/link";
import Logo from "@/components/Logo";
import { IHome, IMed, IBook, IAsk, IMore } from "@/components/Icons";
import { requireMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NAV = [["/app/meditate", "瞑想"], ["/app/together", "一緒に"], ["/app/media", "メディア"], ["/app/audio", "音声"],
  ["/app/live", "思想講座"], ["/app/course", "動画講座"], ["/app/ask", "AI質問"]];

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const m = await requireMember();
  return (
    <>
      <header className="hdr">
        <div className="wrap">
          <Logo href="/app" />
          <nav className="nav member">
            {NAV.map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}
            {m.is_admin && <Link href="/admin" style={{ color: "var(--gold)" }}>管理</Link>}
            <Link href="/app/account">マイページ</Link>
          </nav>
        </div>
      </header>
      <main className="wrap" style={{ paddingTop: 28, paddingBottom: 110 }}>{children}</main>
      <nav className="tabs">
        <Link href="/app"><IHome />ホーム</Link>
        <Link href="/app/meditate"><IMed />瞑想</Link>
        <Link href="/app/media"><IBook />メディア</Link>
        <Link href="/app/ask"><IAsk />AI質問</Link>
        <Link href="/app/account"><IMore />その他</Link>
      </nav>
    </>
  );
}
