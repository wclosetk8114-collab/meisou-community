import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import { askAI } from "@/app/actions/member";
import SubmitButton from "@/components/SubmitButton";

export default async function Ask({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const m = await requireMember();
  const list = await q<any>("select question, answer, to_char(created_at at time zone 'Asia/Tokyo','MM/DD HH24:MI') t from meisou.questions where member_id=$1 order by created_at desc limit 30", [m.id]);
  return (
    <div className="narrow" style={{ padding: 0, maxWidth: 760 }}>
      <p className="en">ASK AI</p>
      <h1 style={{ fontSize: 28 }}>瞑想の質問（AI）</h1>
      <p className="muted">瞑想していて困ったこと、わからないことを書いてください。AIがすぐ答えます。あなたの質問はほかの人には見えません。</p>
      <form action={askAI} className="card">
        {e && <p className="err">{e}</p>}
        <textarea name="question" required maxLength={1000} placeholder="例：瞑想中に考えごとが止まりません。どうしたらいいですか？" />
        <div className="spacer" />
        <SubmitButton label="AIに聞く" pending="考えています…" />
      </form>
      <div className="spacer" />
      {list.map((x: any, i: number) => (
        <div key={i} className="card" style={{ marginBottom: 14 }}>
          <span className="muted">{x.t}</span>
          <p style={{ fontWeight: 700 }} className="prose">Q. {x.question}</p>
          <div className="answer prose">{String(x.answer).replace(/\*\*/g, "").replace(/^#+\s*/gm, "")}</div>
        </div>
      ))}
      <p className="muted">※AIの答えは参考です。体や心の不調があるときは、無理をせず専門家に相談してください。</p>
    </div>
  );
}
