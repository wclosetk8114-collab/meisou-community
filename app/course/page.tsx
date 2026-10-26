import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { SITE, yen } from "@/lib/site";
import { q } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CourseLP() {
  const lessons = await q<{ no: number; title: string }>("select no,title from meisou.lessons order by no").catch(() => []);
  return (
    <>
      <PublicHeader />
      <main className="narrow" style={{ paddingTop: 48 }}>
        <p className="en">MEDITATION COURSE</p>
        <h1>瞑想 動画講座</h1>
        <p>毎日の瞑想で頭がからっぽになってきたら、次の段階へ。<br />思考と視座をひろげる瞑想を、全{SITE.lessonsCount}回の動画で学びます。</p>
        <div className="card" style={{ textAlign: "center", margin: "28px 0" }}>
          <p className="price">{yen(SITE.course)}<small>（税別）</small></p>
          <p className="muted">税込 {yen(SITE.courseTaxIn)}｜動画＋資料｜くり返し見られます</p>
          <p className="muted">お申し込みは運営までご連絡ください。受講が始まると、会員ページに講座が開きます。</p>
        </div>
        <h2>内容</h2>
        <div className="card">
          <ol style={{ margin: 0, paddingLeft: 22 }}>
            {lessons.map((l) => <li key={l.no}>{l.title.replace(/^第\d+回/, "").trim() || "準備中"}</li>)}
          </ol>
        </div>
        <p style={{ textAlign: "center", marginTop: 28 }}><Link href="/login" className="btn ghost">受講中の方はログイン</Link></p>
      </main>
      <footer>© {SITE.name}</footer>
    </>
  );
}
