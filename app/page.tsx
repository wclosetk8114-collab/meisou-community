import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { SITE, yen, joinHref } from "@/lib/site";

const features = [
  { t: "毎日の瞑想", d: "タイマーを押すだけ。終わったら記録が残り、続いた日数が見えます。" },
  { t: "一緒に瞑想", d: "「この時間に一緒に」と募集できます。ひとりより、ずっと続きます。" },
  { t: "メディア", d: "瞑想と思想の記事を、会員だけが読めます。" },
  { t: "音声", d: "ガイド瞑想やお話を、耳だけで。目を閉じたまま聴けます。" },
  { t: "つっちーに質問", d: "瞑想で困ったら質問できます。つっちーが直接答えます。" },
  { t: "月1回 思想講座", d: "オンラインでリアルタイム開催。視座と抽象度を上げる時間です。" },
];

export default function Home() {
  return (
    <>
      <PublicHeader dark />
      <main>
        <section className="hero">
          <span className="vert l">からっぽにする</span>
          <span className="vert r">視座が、ひらく</span>
          <div className="wrap">
            <div className="orbit"><span /><span /><span /><div className="sat"><i /></div></div>
            <p className="en">{SITE.en}</p>
            <h1><span>毎日、瞑想をして</span><span>頭をからっぽにする。</span><br /><span>そこから、</span><span>視座がひらく。</span></h1>
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
          <div className="narrow">
            <div className="card row" style={{ justifyContent: "space-between", gap: 18 }}>
              <div>
                <p className="label" style={{ marginBottom: 4 }}>Free open chat</p>
                <h3 style={{ margin: 0 }}>まずは無料のオープンチャットへ</h3>
                <p className="muted" style={{ margin: "4px 0 0" }}>イベントや最新情報をお届けします。会員でなくても入れます。</p>
              </div>
              <a href={SITE.freeOpenchat} target="_blank" rel="noreferrer" className="btn small" style={{ background: "#06c755", borderColor: "#06c755" }}>LINEで参加する</a>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="narrow" style={{ textAlign: "center" }}>
            <p className="label" style={{ justifyContent: "center" }}><b>05</b> Price</p>
            <div className="card" style={{ padding: "44px 26px" }}>
              <p className="en">Monthly membership</p>
              <p className="price">{yen(SITE.monthly)}<small>／月（税込）</small></p>
              <p className="muted">毎日の瞑想・一緒に瞑想・メディア・音声・月1思想講座・質問<br />すべて込み</p>
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
