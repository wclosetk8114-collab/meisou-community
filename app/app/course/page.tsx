import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import { SITE, yen } from "@/lib/site";

export default async function CourseHome() {
  const m = await requireMember();
  const ok = m.course_access || m.is_admin;
  const lessons = await q<any>("select no,title,description,(video_url<>'') has_video from meisou.lessons order by no");
  return (
    <>
      <p className="en">MEDITATION COURSE</p>
      <h1 style={{ fontSize: 28 }}>瞑想 動画講座（全{SITE.lessonsCount}回）</h1>
      {!ok && (
        <div className="card" style={{ marginBottom: 20, background: "linear-gradient(135deg,#fff,#f8f1e1)" }}>
          <p style={{ margin: 0 }}>この講座は別のお申し込みです。<b>{yen(SITE.course)}（税別）</b>／税込 {yen(SITE.courseTaxIn)}</p>
          <p className="muted">動画と資料をくり返し見られます。お申し込みは運営までご連絡ください。受講が始まると、ここから見られるようになります。</p>
        </div>
      )}
      <div className="grid">
        {lessons.map((l: any) => (
          ok ? (
            <Link key={l.no} href={`/app/course/${l.no}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
              <span className="tag gold">第{l.no}回</span> {!l.has_video && <span className="tag">準備中</span>}
              <h3>{l.title.replace(/^第\d+回/, "").trim()}</h3>
              <p className="muted" style={{ margin: 0 }}>{l.description}</p>
            </Link>
          ) : (
            <div key={l.no} className="card lock"><span className="tag">第{l.no}回</span> <span className="tag">受講者のみ</span><h3>{l.title.replace(/^第\d+回/, "").trim()}</h3></div>
          )
        ))}
      </div>
    </>
  );
}
