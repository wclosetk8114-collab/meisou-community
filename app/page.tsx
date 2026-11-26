import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Intro from "@/components/Intro";
import { SITE, yen, joinHref } from "@/lib/site";



export const revalidate = 300;

const compare: [string, boolean, boolean, boolean, boolean][] = [
  ["イベント・最新情報のお知らせ", true, true, true, true],
  ["毎日の瞑想タイマーと記録", false, true, false, true],
  ["一緒に瞑想する仲間・募集", false, true, false, true],
  ["会員だけのメディア・音声", false, true, false, true],
  ["月1回 思想講座（ライブ＋録画）", false, true, false, true],
  ["つっちーAIに質問", false, true, false, true],
  ["LINEで毎日のお知らせ・記録", false, true, false, true],
  ["会員向けオープンチャット", false, true, false, true],
  ["瞑想 動画講座（全10回）", false, false, true, true],
  ["つっちーと月2回のオンライン伴走", false, false, false, true],
];



export default function Home() {
  return (
    <>
      <PublicHeader dark />
      <main>
        {Date.now() < Date.parse("2026-11-29T00:00:00+09:00") && (
          <div className="preopen">期間限定 先行オープン中（11/28まで）<span>・正式オープンは12/1です</span></div>
        )}
        <section className="hero">
          <span className="vert l">静けさにもどる</span>
          <span className="vert r">視座が、ひらく</span>
          <div className="wrap">
            <div className="orbit"><span /><span /><span /><div className="sat"><i /></div></div>
            <p className="en">{SITE.en}</p>
            <h1><span>毎日、瞑想で</span><span>静けさにもどる。</span><br /><span>そこから、</span><span>視座がひらく。</span></h1>
            <p className="muted" style={{ fontSize: 15 }}>瞑想×思想の、会員制コミュニティ。</p>
            <div className="spacer" />
            <div className="row" style={{ justifyContent: "center", gap: 14 }}>
              <a href={joinHref()} className="btn">初月無料ではじめる</a>
              <Link href="/login" className="btn ghost noarrow">ログイン</Link>
            </div>
          </div>
          <span className="scroll">SCROLL</span>
        </section>

        <Intro />

        <section id="plans" className="section" style={{ paddingTop: 20 }}>
          <div className="wrap">
            <p className="label"><b>07</b> Plans</p>
            <h2>4つのプラン</h2>
            <div className="grid plans" style={{ alignItems: "stretch" }}>
              <div className="card flat">
                <p className="en">Free</p>
                <h3 style={{ margin: "4px 0" }}>無料</h3>
                <p className="price" style={{ fontSize: 34 }}>0円</p>
                <p className="muted">まずは雰囲気を知りたい人へ。イベントや最新情報が届きます。</p>
                <a href={SITE.freeOpenchat} target="_blank" rel="noreferrer" className="btn small ghost">LINEで参加する</a>
              </div>
              <div className="card" style={{ border: "1px solid var(--gold)" }}>
                <p className="en">Member</p>
                <h3 style={{ margin: "4px 0" }}>KUU会員</h3>
                <p className="price" style={{ fontSize: 34 }}><span className="tag gold" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 8 }}>期間限定</span>{yen(SITE.monthly)}<small>／月（税込）</small></p>
                <p className="muted"><b style={{ color: "var(--gold)" }}>最初の1ヶ月は無料。</b>2ヶ月目から1日あたり約{Math.round(SITE.monthly / 30)}円。毎日、静けさにもどる習慣をつくりたい人へ。会費の一部は寄付にあてます。</p>
                <a href={joinHref()} className="btn">初月無料ではじめる</a>
              </div>
              <div className="card">
                <p className="en">Video course <span className="soon-tag">Coming soon</span></p>
                <h3 style={{ margin: "4px 0" }}>動画講座プラン</h3>
                <p className="price" style={{ fontSize: 34 }}>{yen(SITE.course)}<small>（税別）／税込 {yen(SITE.courseTaxIn)}</small></p>
                <p className="muted">全{SITE.lessonsCount}回の動画と資料で、思考と視座をひろげる瞑想を体系的に学びたい人へ。くり返し見られます。</p>
                <span className="btn ghost" style={{ opacity: .6, cursor: "default" }}>準備中</span>
                <a href={SITE.line} target="_blank" rel="noreferrer" className="muted" style={{ fontSize: 12.5, display: "block", marginTop: 8 }}>公開のお知らせをLINEで受け取る</a>
              </div>
              <div className="card" style={{ background: "linear-gradient(160deg,#0f1c3a,#24427e)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}>
                <p className="en" style={{ color: "#bcd8f7" }}>Accompany <span className="soon-tag dark">Coming soon</span></p>
                <h3 style={{ margin: "4px 0", color: "#fff" }}>伴走プラン</h3>
                <p className="price" style={{ fontSize: 34, color: "#fff" }}>{yen(SITE.bansou)}<small style={{ color: "rgba(230,240,255,.8)" }}>／{SITE.bansouMonths}ヶ月（税別）</small></p>
                <p style={{ color: "rgba(230,240,255,.85)", fontSize: 13.5 }}>つっちーと月{SITE.bansouPerMonth}回のオンラインで、本気で変わりたい人へ。会員の機能と動画講座もすべて込み。{SITE.bansouMonths}ヶ月後からは月額{yen(SITE.monthly)}に。</p>
                <a href="#bansou" className="btn" style={{ background: "#fff", color: "#0f1c3a", borderColor: "#fff" }}>準備中・くわしく見る</a>
              </div>
            </div>
            <div className="card" style={{ marginTop: 18, overflowX: "auto" }}>
              <table>
                <thead><tr><th></th><th style={{ textAlign: "center" }}>無料</th><th style={{ textAlign: "center" }}>会員</th><th style={{ textAlign: "center" }}>動画講座</th><th style={{ textAlign: "center" }}>伴走</th></tr></thead>
                <tbody>
                  {compare.map(([t, f, m, v, b]) => (
                    <tr key={t}><td>{t}</td>
                      <td style={{ textAlign: "center", fontSize: 18, color: f ? "var(--gold)" : "var(--sub)" }}>{f ? "○" : "—"}</td>
                      <td style={{ textAlign: "center", fontSize: 18, color: m ? "var(--gold)" : "var(--sub)" }}>{m ? "○" : "—"}</td>
                      <td style={{ textAlign: "center", fontSize: 18, color: v ? "var(--gold)" : "var(--sub)" }}>{v ? "○" : "—"}</td>
                      <td style={{ textAlign: "center", fontSize: 18, color: b ? "var(--gold)" : "var(--sub)" }}>{b ? "○" : "—"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="narrow" style={{ textAlign: "center" }}>
            <p className="label" style={{ justifyContent: "center" }}><b>08</b> Price</p>
            <div className="card" style={{ padding: "44px 26px" }}>
              <p className="en">Monthly membership</p>
              <p className="price"><span className="tag gold" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 8 }}>期間限定</span>{yen(SITE.monthly)}<small>／月（税込）</small></p>
              <p style={{ margin: "4px 0 10px" }}><span className="tag gold" style={{ fontSize: 13, padding: "4px 14px" }}>最初の1ヶ月は無料</span></p>
              <p className="muted">2ヶ月目から月額{yen(SITE.monthly)}（税込）。無料の間に退会すれば、お金は一切かかりません。</p>
              <p className="muted">毎日の瞑想・一緒に瞑想・メディア・音声・月1思想講座・つっちーAI質問・LINE連動<br />すべて込み</p>
              <div className="spacer" />
              <a href={joinHref()} className="btn gold">初月無料ではじめる</a>
              <div style={{ marginTop: 22, padding: "16px 18px", borderRadius: 14, background: "rgba(255,255,255,.55)", border: "1px solid var(--line)", textAlign: "left" }}>
                <p className="label" style={{ marginBottom: 4 }}>Give</p>
                <p style={{ margin: 0, fontSize: 14 }}>会費の一部は、寄付にあてています。<br /><span className="muted">あなたが静けさにもどる時間が、だれかの支えにもつながります。</span></p>
              </div>
              <p className="muted" style={{ marginTop: 18, fontSize: 12.5 }}>退会はマイページからいつでも。退会すると会員ページは見られなくなります。</p>
            </div>
            <p style={{ marginTop: 34 }}><Link href="/course">もっと深めたい方へ　動画講座（全{SITE.lessonsCount}回）・Coming soon</Link></p>
          </div>
        </section>

        <section id="bansou" className="section" style={{ paddingTop: 20 }}>
          <div className="narrow">
            <p className="label"><b>09</b> Accompany</p>
            <h2>伴走プラン <span className="soon-tag">Coming soon</span></h2>
            <p>ひとりで続けるより、確実に変わりたい人へ。<br />{SITE.bansouMonths}ヶ月間、つっちーが月{SITE.bansouPerMonth}回オンラインでとなりを走ります。</p>
            <div className="flow" style={{ marginTop: 20, gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
              <div><h3>手放す</h3><p className="muted">いま頭の中にあるものを一緒に整理。あなたに合う瞑想のやり方を決めます。</p></div>
              <div><h3>入れる</h3><p className="muted">動画講座と思想講座で、新しい考え方と価値基準を入れていきます。</p></div>
              <div><h3>変わる</h3><p className="muted">毎回のオンラインで、日々の選び方・行動がどう変わったかを一緒に確かめます。</p></div>
            </div>
            <div className="card" style={{ marginTop: 20 }}>
              <table>
                <tbody>
                  <tr><th>期間</th><td>{SITE.bansouMonths}ヶ月</td></tr>
                  <tr><th>オンライン</th><td>月{SITE.bansouPerMonth}回 × {SITE.bansouMonths}ヶ月（計{SITE.bansouPerMonth * SITE.bansouMonths}回）</td></tr>
                  <tr><th>込みのもの</th><td>KUU会員のすべての機能／瞑想 動画講座（全{SITE.lessonsCount}回・資料つき）</td></tr>
                  <tr><th>料金</th><td><b>{yen(SITE.bansou)}</b>（税別）／税込 {yen(SITE.bansouTaxIn)}</td></tr>
                  <tr><th>{SITE.bansouMonths}ヶ月のあと</th><td>KUU会員として、月額 {yen(SITE.monthly)}（税込）で続けられます</td></tr>
                </tbody>
              </table>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <p className="mincho" style={{ fontSize: 18, margin: "0 0 12px" }}>ただいま準備中です</p>
                <a href={SITE.line} target="_blank" rel="noreferrer" className="btn gold">公開のお知らせをLINEで受け取る</a>
                <p className="muted" style={{ marginTop: 10, fontSize: 12.5 }}>はじまったら、KUU公式LINEでいちばんにお知らせします。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer><a href={SITE.freeOpenchat} target="_blank" rel="noreferrer">無料オープンチャット（イベント・最新情報）</a><br /><br />© {SITE.en}</footer>
    </>
  );
}
