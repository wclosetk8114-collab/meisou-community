import Link from "next/link";
import Logo from "./Logo";
export default function PublicHeader() {
  return (
    <header className="hdr">
      <div className="wrap">
        <Logo />
        <nav className="nav">
          <Link href="/#concept" className="pc">コンセプト</Link>
          <Link href="/course">動画講座</Link>
          <Link href="/login">ログイン</Link>
        </nav>
      </div>
    </header>
  );
}
