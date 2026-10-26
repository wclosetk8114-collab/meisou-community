import { one } from "@/lib/db";
import { SITE } from "@/lib/site";
import { createLineCode, unlinkLine, toggleRemind } from "@/app/actions/member";

export default async function LineLink({ memberId }: { memberId: string }) {
  const r = await one<{ line_user_id: string | null; line_link_code: string | null; valid: boolean; line_remind: boolean }>(
    "select line_user_id, line_link_code, (line_code_expires > now()) as valid, line_remind from meisou.members where id=$1", [memberId]);
  const linked = !!r?.line_user_id;
  return (
    <div className="card" id="line" style={{ marginTop: 16 }}>
      <p className="label" style={{ marginBottom: 4 }}>LINE</p>
      <h3 style={{ marginTop: 0 }}>KUU公式LINEとつなぐ</h3>
      {linked ? (
        <>
          <p className="ok" style={{ margin: "8px 0" }}>つながっています</p>
          <p className="muted">LINEで「瞑想した」と送ると記録、「質問 〜」でつっちーAIが答えます。思想講座の前日・新しい記事や音声もLINEに届きます。</p>
          <div className="row">
            <form action={toggleRemind}><button className="btn small ghost">{r?.line_remind ? "毎晩のお知らせを止める" : "毎晩のお知らせを受け取る"}</button></form>
            <form action={unlinkLine}><button className="btn small ghost">つながりを解除</button></form>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>毎晩のお知らせ：{r?.line_remind ? "受け取る（21時・まだの日だけ）" : "止めている"}</p>
        </>
      ) : r?.line_link_code && r.valid ? (
        <>
          <p className="muted" style={{ marginBottom: 4 }}>このコードをKUU公式LINEに送ってください（30分有効）</p>
          <p className="num" style={{ letterSpacing: ".2em", margin: "4px 0 12px" }}>{r.line_link_code}</p>
          <a href={SITE.line} target="_blank" rel="noreferrer" className="btn small" style={{ background: "#06c755", borderColor: "#06c755" }}>KUU公式LINEを開く</a>
          <p className="muted" style={{ marginTop: 10 }}>送ったら、このページを開き直すと「つながっています」に変わります。</p>
        </>
      ) : (
        <>
          <p className="muted">つなぐと、毎日の瞑想のお知らせ・記録・質問・新しい記事のお届けがLINEでできるようになります。</p>
          <form action={createLineCode}><button className="btn small">つなぐためのコードを出す</button></form>
        </>
      )}
    </div>
  );
}
