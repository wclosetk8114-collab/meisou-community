import Link from "next/link";
import Logo from "./Logo";
export default function PublicHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`hdr ${dark ? "dark" : ""}`}>
      <div className="wrap">
        <Logo light={dark} />
        <nav className="nav">
          <Link href="/#kyojigen" className="pc">虚次元とは</Link>
          <Link href="/course">動画講座</Link>
          <Link href="/login">ログイン</Link>
        </nav>
      </div>
    </header>
  );
}
