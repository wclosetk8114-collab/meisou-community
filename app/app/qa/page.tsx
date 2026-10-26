import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import { askQuestion } from "@/app/actions/member";
import Answer from "@/components/Answer";

export default async function QA({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { e, ok } = await searchParams;
  const m = await requireMember();
  const mine = await q<any>("select question, answer, to_char(created_at at time zone 'Asia/Tokyo','MM.DD') d, to_char(answered_at at time zone 'Asia/Tokyo','MM.DD') ad from meisou.questions where member_id=$1 order by created_at desc limit 20", [m.id]);
  const pub = await q<any>("select question, answer, to_char(answered_at at time zone 'Asia/Tokyo','MM.DD') ad from meisou.questions where is_public and answer<>'' and member_id<>$1 order by answered_at desc limit 50", [m.id]);
  return (
    <div className="narrow" style={{ padding: 0, maxWidth: 760 }}>
      <div className="page-head">
        <p className="en">Q &amp; A</p>
        <h1 style={{ fontSize: "clamp(24px,4vw,32px)" }}>瞑想の質問</h1>
        <p className="muted">瞑想していて困ったこと、わからないことを送ってください。つっちーが直接答えます。</p>
      </div>
      <form action={askQuestion} className="card">
        {e && <p className="err">{e}</p>}{ok && <p className="ok">{ok}</p>}
        <textarea name="question" required maxLength={1000} placeholder="例：瞑想中に考えごとが止まりません。どうしたらいいですか？" />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="is_public" defaultChecked style={{ width: "auto" }} /> 回答をほかの会員にも見せてOK（名前は出ません）
        </label>
        <div className="spacer" />
        <button className="btn">質問を送る</button>
      </form>

      {mine.length > 0 && <>
        <h2 style={{ marginTop: 40 }}>あなたの質問</h2>
        {mine.map((x: any, i: number) => (
          <div key={i} className="card" style={{ marginBottom: 14 }}>
            <span className="muted">{x.d}</span>
            <p className="prose" style={{ fontWeight: 500 }}>Q. {x.question}</p>
            {x.answer ? <Answer text={x.answer} date={x.ad} /> : <span className="tag">回答待ち</span>}
          </div>
        ))}
      </>}

      <h2 style={{ marginTop: 40 }}>みんなの質問</h2>
      {pub.length === 0 && <p className="muted">まだありません。</p>}
      {pub.map((x: any, i: number) => (
        <div key={i} className="card" style={{ marginBottom: 14 }}>
          <p className="prose" style={{ fontWeight: 500, marginTop: 0 }}>Q. {x.question}</p>
          <Answer text={x.answer} date={x.ad} />
        </div>
      ))}
    </div>
  );
}
