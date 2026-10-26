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

const compare: [string, boolean, boolean][] = [
  ["イベント・最新情報のお知らせ", true, true],
  ["毎日の瞑想タイマーと記録", false, true],
  ["一緒に瞑想する仲間・募集", false, true],
  ["会員だけのメディア・音声", false, true],
  ["月1回 思想講座（ライブ＋録画）", false, true],
  ["つっちーAIに質問", false, true],
  ["LINEで毎日のお知らせ・記録", false, true],
  ["会員向けオープンチャット", false, true],
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
            <p className="muted" style={{ fontSize: 15 }}>いっしょに瞑想する、会員制のコミュニティ。</p>
            <div className="spacer" />
            <div className="row" style={{ justifyContent: "center", gap: 14 }}>
              <a href={joinHref()} className="btn">会員になる</a>
              <Link href="/login" className="btn ghost noarrow">ログイン</Link>
            </div>
          </div>
          <span className="scroll">SCROLL</span>
        </section>

        <section id="kyojigen" className="section">
          <div className="narrow">
            <p className="label"><b>01</b> About 虚次元</p>
            <h2>虚次元（きょじげん）とは</h2>
            <p className="big-quote">目に見える世界は、<br />ほんの一部。<br />見えない次元まで、<span className="gold">視野をひろげる</span>。</p>
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
            <h2>3つの段階で、深めていく</h2>
            <div className="flow">
              <div><h3>毎日、からっぽにする</h3><p className="muted">短くてもいいので毎日。仲間と一緒に。</p></div>
              <div><h3>月1回、視座をひらく</h3><p className="muted">思想講座で、ものの見方をひろげる。</p></div>
              <div><h3>深めたい人は、動画講座へ</h3><p className="muted">全{SITE.lessonsCount}回で、体系的に学ぶ。</p></div>
            </div>
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
                <p style={{ margin: 0 }}>これまで1万人のリハビリにたずさわってきました。からだと心の両方を見てきたからこそ、「頭を休める時間」の大切さを知っています。自分自身も毎日瞑想を続けて、この1年でいちばん大きな変化を感じています。</p>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="section" style={{ paddingTop: 20 }}>
          <div className="wrap">
            <p className="label"><b>07</b> Free or Member</p>
            <h2>無料と会員のちがい</h2>
            <div className="grid" style={{ alignItems: "stretch" }}>
              <div className="card flat">
                <p className="en">Free</p>
                <h3 style={{ margin: "4px 0" }}>無料オープンチャット</h3>
                <p className="price" style={{ fontSize: 34 }}>0円</p>
                <p className="muted">まずは雰囲気を知りたい人へ。イベントや最新情報が届きます。</p>
                <a href={SITE.freeOpenchat} target="_blank" rel="noreferrer" className="btn small ghost">LINEで参加する</a>
              </div>
              <div className="card" style={{ border: "1px solid var(--gold)" }}>
                <p className="en">Member</p>
                <h3 style={{ margin: "4px 0" }}>KUU会員</h3>
                <p className="price" style={{ fontSize: 34 }}>{yen(SITE.monthly)}<small>／月（税込）</small></p>
                <p className="muted">1日あたり約{Math.round(SITE.monthly / 30)}円。毎日、静けさにもどる習慣をつくりたい人へ。</p>
                <a href={joinHref()} className="btn">会員になる</a>
              </div>
            </div>
            <div className="card" style={{ marginTop: 18, overflowX: "auto" }}>
              <table>
                <thead><tr><th></th><th style={{ textAlign: "center" }}>無料</th><th style={{ textAlign: "center" }}>会員</th></tr></thead>
                <tbody>
                  {compare.map(([t, f, m]) => (
                    <tr key={t}><td>{t}</td>
                      <td style={{ textAlign: "center", fontSize: 18, color: f ? "var(--gold)" : "var(--sub)" }}>{f ? "○" : "—"}</td>
                      <td style={{ textAlign: "center", fontSize: 18, color: m ? "var(--gold)" : "var(--sub)" }}>{m ? "○" : "—"}</td></tr>
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
              <p className="price">{yen(SITE.monthly)}<small>／月（税込）</small></p>
              <p className="muted">毎日の瞑想・一緒に瞑想・メディア・音声・月1思想講座・つっちーAI質問・LINE連動<br />すべて込み</p>
              <div className="spacer" />
              <a href={joinHref()} className="btn gold">会員になる</a>
              <p className="muted" style={{ marginTop: 18, fontSize: 12.5 }}>退会はマイページからいつでも。退会すると会員ページは見られなくなります。</p>
            </div>
            <p style={{ marginTop: 34 }}><Link href="/course">もっと深めたい方へ　動画講座（全{SITE.lessonsCount}回）</Link></p>
          </div>
        </section>
      </main>
      <footer><a href={SITE.freeOpenchat} target="_blank" rel="noreferrer">無料オープンチャット（イベント・最新情報）</a><br /><br />© {SITE.en}</footer>
    </>
  );
}
