import { SITE } from "@/lib/site";

const features = [
  { t: "毎日の瞑想", d: "タイマーを押すだけ。終わったら記録が残り、続いた日数が見えます。" },
  { t: "一緒に瞑想", d: "「この時間に一緒に」と募集できます。ひとりより、ずっと続きます。" },
  { t: "メディア", d: "瞑想と思想の記事を、会員だけが読めます。" },
  { t: "音声", d: "ガイド瞑想やお話を、耳だけで。目を閉じたまま聴けます。" },
  { t: "つっちーAIに質問", d: "瞑想で困ったら質問できます。つっちーAIがすぐに答えます。" },
  { t: "月1回 思想講座", d: "オンラインでリアルタイム開催。視座と抽象度を上げる時間です。録画もあとから見られます。" },
  { t: "LINEでつながる", d: "毎晩のお知らせ、「瞑想した」で記録、質問もLINEから。続ける仕組みが手のひらに。" },
];

const changes = [
  { b: "寝る前も頭の中がずっとうるさい", a: "毎日いったん静けさにもどれる場所がある" },
  { b: "瞑想アプリを入れても三日坊主", a: "記録・仲間・LINEのお知らせで、気づけば続いている" },
  { b: "同じことでぐるぐる悩む", a: "一段上の視点から、自分の悩みを見られるようになる" },
];

/** LP と Coming soon の両方で使う「中身の紹介」（虚次元〜案内人） */
export default function Intro() {
  return (
    <>
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

    </>
  );
}
