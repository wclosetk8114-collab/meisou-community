import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Timer from "@/components/Timer";
import GuestDragon from "@/components/GuestDragon";
import { SITE } from "@/lib/site";

export const metadata = { title: `無料で瞑想する｜${SITE.name}`, description: "登録なしで使える瞑想タイマー。呼吸法とヒーリング音楽つき。" };

export default function Try() {
  return (
    <>
      <PublicHeader />
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <p className="en">FREE MEDITATION</p>
        <h1 style={{ fontSize: 30 }}>登録なしで、いますぐ瞑想</h1>
        <p className="muted">呼吸法とヒーリング音楽を選んで、はじめるだけ。記録はこの端末に残ります。</p>
        <div className="grid" style={{ alignItems: "start", marginTop: 18 }}>
          <Timer guest />
          <div>
            <GuestDragon />
            <div className="card" style={{ marginTop: 18 }}>
              <h3 style={{ marginTop: 0 }}>記録をずっと残したくなったら</h3>
              <p className="muted">名前とメールだけの無料登録で、記録・カレンダー・育つ竜がどの端末でも使えて、メディアの記事も全部読めます。</p>
              <Link href="/join-free" className="btn small">無料登録する</Link>
              <span className="muted" style={{ fontSize: 13, marginLeft: 10 }}>登録ずみの方は <Link href="/login">ログイン</Link></span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
