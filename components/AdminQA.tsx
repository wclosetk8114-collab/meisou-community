import { q } from "@/lib/db";
import { relatedDocs } from "@/lib/knowledge";
import * as A from "@/app/actions/admin";
import * as K from "@/app/actions/knowledge";

// 管理画面：質問タブ（参考資料つき）と参考資料タブ
export async function Questions() {
  const list = await q<any>(`select qq.*, m.name, to_char(qq.created_at at time zone 'Asia/Tokyo','MM/DD HH24:MI') t
    from meisou.questions qq join meisou.members m on m.id=qq.member_id order by (qq.answer='') desc, qq.created_at desc limit 100`);
  const waiting = list.filter((x: any) => !x.answer).length;
  const rel = await Promise.all(list.map((x: any) => (x.answer ? Promise.resolve([]) : relatedDocs(x.question, 5))));
  return (
    <>
      <h2 style={{ marginTop: 0 }}>質問（回答待ち {waiting}件）</h2>
      <p className="muted">質問が来ると、つっちーAIが参考資料をもとにすぐ答えます。回答は直して保存できます（直すと「つっちー」の回答になります）。AIが答えられなかった質問は「回答待ち」で残るので、「AIで下書き」か手で答えてください。</p>
      {list.map((x: any, i: number) => {
        const chosen = new Set((x.refs || []).map((r: any) => r.url));
        return (
        <form action={K.answerWithRefs} className="card" key={x.id} style={{ marginBottom: 12 }}>
          <input type="hidden" name="id" value={x.id} />
          <span className="muted">{x.t}　{x.name}さん</span> {x.answer ? <span className="tag">{x.by_ai ? "つっちーAIが回答" : "回答済み"}</span> : <span className="tag gold">回答待ち</span>}
          <p className="prose" style={{ fontWeight: 500 }}>Q. {x.question}</p>
          {rel[i].length > 0 && (
            <div style={{ background: "#f6f3fb", borderRadius: 10, padding: "10px 14px", margin: "8px 0 12px" }}>
              <b style={{ fontSize: 13 }}>参考になりそうな資料</b>
              {rel[i].map((d: any) => (
                <details key={d.id} style={{ marginTop: 6, fontSize: 13.5 }}>
                  <summary style={{ cursor: "pointer" }}>
                    <span className="tag" style={{ fontSize: 11 }}>{d.source === "imedia" ? "i.media" : d.source === "kuu" ? "KUU記事" : "資料"}</span> {d.title}
                  </summary>
                  <div className="prose muted" style={{ maxHeight: 260, overflow: "auto", padding: "6px 0", fontSize: 13 }}>{d.body.slice(0, 2000)}{d.body.length > 2000 ? "…" : ""}</div>
                  {d.url && <a href={d.url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5 }}>記事を開く</a>}
                </details>
              ))}
              {rel[i].some((d: any) => d.url) && <p className="muted" style={{ fontSize: 12.5, margin: "10px 0 2px" }}>回答の下に「参考記事」として載せるもの：</p>}
              {rel[i].filter((d: any) => d.url).map((d: any) => (
                <label key={"r" + d.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                  <input type="checkbox" name="ref" value={JSON.stringify({ title: d.title, url: d.url })} defaultChecked={chosen.has(d.url)} style={{ width: "auto" }} /> {d.title}
                </label>
              ))}
            </div>
          )}
          <textarea name="answer" defaultValue={x.answer || x.draft} placeholder="回答を書く" style={{ minHeight: 160 }} />
          {!x.answer && x.draft && <p className="muted" style={{ fontSize: 12.5, margin: "4px 0 0" }}>↑ AIの下書きです。直してから保存してください。</p>}
          {(x.refs || []).length > 0 && x.answer && (
            <p className="muted" style={{ fontSize: 12.5 }}>参考記事：{(x.refs || []).map((r: any) => r.title).join("／")}</p>
          )}
          {(x.refs || []).length > 0 && x.answer && (x.refs || []).map((r: any) => <input key={r.url} type="hidden" name="ref" value={JSON.stringify(r)} />)}
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="is_public" defaultChecked={x.is_public} style={{ width: "auto" }} /> みんなに公開（名前は出ません）</label>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn small">回答を保存</button>
            {!x.answer && <button className="btn small ghost" formAction={K.draftQuestion}>AIで下書き</button>}
            <button className="btn small ghost" formAction={A.deleteQuestion}>削除</button>
          </div>
        </form>
        );
      })}
    </>
  );
}

export async function Knowledge() {
  const list = await q<any>("select id, source, title, url, length(body) n from meisou.knowledge order by source, title");
  const pj = list.filter((d: any) => d.source !== "imedia"), im = list.filter((d: any) => d.source === "imedia");
  return (
    <>
      <h2 style={{ marginTop: 0 }}>参考資料（{list.length}本）</h2>
      <p className="muted">質問に答えるときの参考です。会員には見えません（i.mediaの記事だけ、回答の「参考記事」としてリンクを載せられます）。</p>
      <form action={K.syncImedia} className="card" style={{ marginBottom: 16 }}>
        <b>i.media の記事</b>（{im.length}本）
        <p className="muted" style={{ margin: "6px 0 10px" }}>iii-iii.com/i.media の記事をまとめて取り込みます。新しい記事が出たらもう一度押してください。</p>
        <button className="btn small">i.media から取り込む</button>
      </form>
      {[["i.media", im], ["プロジェクトの記事", pj]].map(([label, arr]: any) => (
        <div className="card" key={label} style={{ marginBottom: 16, overflowX: "auto" }}>
          <h3 style={{ marginTop: 0 }}>{label}（{arr.length}本）</h3>
          <table><tbody>{arr.map((d: any) => (
            <tr key={d.id}>
              <td>{d.url ? <a href={d.url} target="_blank" rel="noreferrer">{d.title}</a> : d.title}<br /><span className="muted" style={{ fontSize: 12 }}>{d.n.toLocaleString()}字</span></td>
              <td><form action={K.deleteKnowledge}><input type="hidden" name="id" value={d.id} /><button className="btn small ghost">削除</button></form></td>
            </tr>))}</tbody></table>
        </div>
      ))}
    </>
  );
}
