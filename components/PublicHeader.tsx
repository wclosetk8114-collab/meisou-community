import Link from "next/link";
import { SITE } from "@/lib/site";
export default function PublicHeader() {
  return (
    <header className="hdr">
      <div className="wrap">
        <Link href="/" className="logo">{SITE.name}<span>.</span></Link>
        <nav className="nav">
          <Link href="/#about">はじめに</Link>
          <Link href="/course">動画講座</Link>
          <Link href="/login">ログイン</Link>
        </nav>
      </div>
    </header>
  );
}
