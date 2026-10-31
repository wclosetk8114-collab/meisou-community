import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { SITE, yen, joinHref } from "@/lib/site";

const features = [
  { t: "毎日の瞑想", d: "タイマーを押すだけ。終わったら記録が残り、続いた日数が見えます。" },
  { t: "一緒に瞑想", d: "「この時間に一緒に」と募集できます。ひとりより、ずっと続きます。" },
  { t: "メディア", d: "瞑想と思想の記事を、会員だけが読めます。" },
  { t: "音声", d: "ガイド瞑想やお話を、耳だけで。目を閉じたまま聴けます。" },
  { t: "つっちーAIに質問", d: "瞑想で困ったら質問できます。つっちーAIがすぐに答えます。" },
  { t: "月1回 思想講座", d: "オンラインでリアルタイム開催。視座と抽象度を上げる時間です。録画もあとから見られます。" },
  { t: "LINEでつながる", d: "毎晩のお知らせ、「瞑想した」で記録、質問もLINEから。続ける仕組みが手のひらに。" },
];

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

const changes = [
  { b: "寝る前も頭の中がずっとうるさい", a: "毎日いったん静けさにもどれる場所がある" },
  { b: "瞑想アプリを入れても三日坊主", a: "記録・仲間・LINEのお知らせで、気づけば続いている" },
  { b: "同じことでぐるぐる悩む", a: "一段上の視点から、自分の悩みを見られるようになる" },
];

export default function Home() {
  return (
    <>
      <PublicHeader dark />
      <main>
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

        <section id="kyojigen" className="section">
          <div className="narrow">
            <p className="label"><b>01</b> About 虚次元</p>
            <h2>虚次元（きょじげん）とは</h2>
            <p className="big-quote">目に見える世界は、<br />ほんの一部。<br />見えない次元まで、<span className="gold">視座をひろげる</span>。</p>
            <hr className="hair" />
            <p>虚次元は、村主悠真さんが提唱している「世界のとらえ方」です。</p>
            <p>わたしたちがふだん見ているのは、目に見える「実」の世界。でも世界には、目に見えない「虚」の次元もあります。数学で、目に見えない「虚数」があるからこそ、数の世界がひろがったのと同じです。</p>
            <p>見えている世界だけで考えると、答えはせまくなります。見えない次元まで含めて世界をとらえると、思考がひろがり、視座が上がり、抽象度が上がる。虚次元は、そのための考え方です。</p>
            <p>この場所の瞑想は、虚次元からヒントをもらっています。でも、虚次元を知らなくても大丈夫。だれでも、そのまま始められます。</p>
          </div>
        </section>

        <section id="concept" className="section" style={{ paddingTop: 20 }}>
          <div className="narrow">
            <p className="label"><b>02</b> Concept</p>
            <p className="big-quote">ふつうの瞑想は、<br />リラックスのため。<br />ここでの瞑想は、<br /><span className="gold">その先へ</span>ひろげるため。</p>
            <hr className="hair" />
            <p>思考をひろげる。視座を上げる。抽象度を上げる。</p>
            <p>でもその前に、毎日たくさんの情報を入れている頭は、それだけでいっぱいです。だから、毎日の瞑想でいったん取り払う。ここが出発点です。</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="wrap">
            <p className="label"><b>03</b> Journey</p>
            <h2>静けさで空けて、新しい視点を入れて、行動が変わる。</h2>
            <div className="flow">
              <div><h3 style={{ fontSize: 26 }}>手放す</h3><p className="muted">毎日の瞑想で、余計な思考を取りのぞく。</p></div>
              <div><h3 style={{ fontSize: 26 }}>入れる</h3><p className="muted">月1回の思想講座で、新しい考え方と価値基準を入れる。</p></div>
              <div><h3 style={{ fontSize: 26 }}>変わる</h3><p className="muted">仲間と続けるうちに、選ぶこと・やることが変わっていく。</p></div>
            </div>
            <p className="muted" style={{ marginTop: 14 }}>もっと深めたい人には、全{SITE.lessonsCount}回の動画講座もあります。</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="wrap">
            <p className="label"><b>04</b> Membership</p>
            <h2>会員になると、使えるもの</h2>
            <div className="feat">
              {features.map((f, i) => (
                <div key={f.t}><span className="no">0{i + 1}</span><h3 style={{ marginTop: 14 }}>{f.t}</h3><p className="muted" style={{ margin: 0 }}>{f.d}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="wrap">
            <p className="label"><b>05</b> Change</p>
            <h2>続けると、こう変わる</h2>
            <div className="grid">
              {changes.map((c) => (
                <div className="card" key={c.b}>
                  <span className="tag">BEFORE</span>
                  <p className="muted" style={{ margin: "8px 0 14px" }}>{c.b}</p>
                  <span className="tag gold">AFTER</span>
                  <h3 style={{ margin: "8px 0 0" }}>{c.a}</h3>
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12 }}>※変化の感じ方には個人差があります。</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="narrow">
            <p className="label"><b>06</b> Guide</p>
            <h2>案内人</h2>
            <div className="card" style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <img src="/tsuchii.jpg" alt="つっちー" width={96} height={96} style={{ borderRadius: "50%", border: "1px solid var(--gold-l)" }} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ margin: 0 }}>つっちー</h3>
                <p className="muted" style={{ margin: "2px 0 10px" }}>理学療法士</p>
                <p style={{ margin: 0 }}>これまで1万人のリハビリにたずさわってきました。からだと心の両方を見てきたからこそ、「頭を休める時間」の大切さを知っています。2025年から虚次元のΛ（ラムダ）瞑想・θ（シータ）回廊を受けはじめ、それから毎日瞑想を続けています。この1年でいちばん大きな変化でした。</p>
                <p style={{ margin: "10px 0 0" }}>いまは、虚次元のメディア『視座プラス』の管理人、コミュニティ「虚点」の事務局もつとめています。</p>
              </div>
            </div>
          </div>
        </section>

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
                <p className="en">Video course</p>
                <h3 style={{ margin: "4px 0" }}>動画講座プラン</h3>
                <p className="price" style={{ fontSize: 34 }}>{yen(SITE.course)}<small>（税別）／税込 {yen(SITE.courseTaxIn)}</small></p>
                <p className="muted">全{SITE.lessonsCount}回の動画と資料で、思考と視座をひろげる瞑想を体系的に学びたい人へ。くり返し見られます。</p>
                <a href="/course" className="btn ghost">内容を見る</a>
              </div>
              <div className="card" style={{ background: "linear-gradient(160deg,#0f1c3a,#24427e)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}>
                <p className="en" style={{ color: "#bcd8f7" }}>Accompany</p>
                <h3 style={{ margin: "4px 0", color: "#fff" }}>伴走プラン</h3>
                <p className="price" style={{ fontSize: 34, color: "#fff" }}>{yen(SITE.bansou)}<small style={{ color: "rgba(230,240,255,.8)" }}>／{SITE.bansouMonths}ヶ月（税別）</small></p>
                <p style={{ color: "rgba(230,240,255,.85)", fontSize: 13.5 }}>つっちーと月{SITE.bansouPerMonth}回のオンラインで、本気で変わりたい人へ。会員の機能と動画講座もすべて込み。{SITE.bansouMonths}ヶ月後からは月額{yen(SITE.monthly)}に。</p>
                <a href="#bansou" className="btn" style={{ background: "#fff", color: "#0f1c3a", borderColor: "#fff" }}>くわしく見る</a>
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
            <p style={{ marginTop: 34 }}><Link href="/course">もっと深めたい方へ　動画講座（全{SITE.lessonsCount}回）</Link></p>
          </div>
        </section>

        <section id="bansou" className="section" style={{ paddingTop: 20 }}>
          <div className="narrow">
            <p className="label"><b>09</b> Accompany</p>
            <h2>伴走プラン</h2>
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
                <a href={SITE.line} target="_blank" rel="noreferrer" className="btn gold">KUU公式LINEで相談する</a>
                <p className="muted" style={{ marginTop: 10, fontSize: 12.5 }}>お申し込み・ご相談は、LINEから気軽にどうぞ。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer><a href={SITE.freeOpenchat} target="_blank" rel="noreferrer">無料オープンチャット（イベント・最新情報）</a><br /><br />© {SITE.en}</footer>
    </>
  );
}
