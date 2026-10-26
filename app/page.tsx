import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { SITE, yen } from "@/lib/site";

const features = [
  { t: "毎日の瞑想", d: "タイマーを押すだけ。終わったら記録が残り、続いた日数が見えます。" },
  { t: "一緒に瞑想", d: "「この時間に一緒にやろう」と募集できます。ひとりより続きます。" },
  { t: "メディア", d: "瞑想と思想の記事を、会員だけが読めます。" },
  { t: "音声", d: "ガイド瞑想や話を音声で届けます。耳だけで聴けます。" },
  { t: "月1回 思想講座", d: "オンラインでリアルタイム開催。視座と抽象度を上げる時間です。" },
  { t: "AIに質問", d: "瞑想で困ったら、24時間いつでもAIに聞けます。" },
];

export default function Home() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="circle"><i /></div>
            <p className="en">{SITE.en}</p>
            <h1>{SITE.tagline.split("。")[0]}。<br />{SITE.tagline.split("。")[1]}。</h1>
            <p className="muted">毎日いっしょに瞑想する、会員制のコミュニティです。</p>
            <div className="spacer" />
            <Link href="/signup" className="btn gold">会員になる</Link>
            <div style={{ marginTop: 12 }}><Link href="/login" className="muted">会員の方はログイン</Link></div>
          </div>
        </section>

        <section id="about" className="narrow">
          <h2>まず、からっぽにする</h2>
          <p>
            ふつうの瞑想は、リラックスのためのものが多いです。<br />
            ここでやる瞑想は、その先があります。思考をひろげる。視座を上げる。抽象度を上げる。
          </p>
          <p>
            でも、その前に。<br />
            毎日たくさんの情報を入れている頭は、それだけでいっぱいです。<br />
            だから<b>毎日の瞑想で、いったん取り払う</b>。ここが出発点です。
          </p>
          <div className="line" />
          <ol className="steps">
            <li><b>毎日、からっぽにする</b><br /><span className="muted">短くてもいいので毎日。仲間と一緒に。</span></li>
            <li><b>月1回、視座をひらく</b><br /><span className="muted">思想講座で、ものの見方をひろげる。</span></li>
            <li><b>深めたい人は、動画講座へ</b><br /><span className="muted">全{SITE.lessonsCount}回の瞑想講座で、体系的に学ぶ。</span></li>
          </ol>
        </section>

        <section className="wrap">
          <h2 style={{ textAlign: "center" }}>会員になると使えるもの</h2>
          <div className="grid">
            {features.map((f) => (
              <div className="card" key={f.t}>
                <h3>{f.t}</h3>
                <p className="muted" style={{ margin: 0 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="narrow" style={{ textAlign: "center" }}>
          <h2>料金</h2>
          <div className="card">
            <p className="en">MONTHLY</p>
            <p className="price">{yen(SITE.monthly)}<small>／月（税込）</small></p>
            <p className="muted">毎日の瞑想・一緒に瞑想・メディア・音声・月1思想講座・AI質問　すべて込み</p>
            <Link href="/signup" className="btn gold">会員になる</Link>
            <p className="muted" style={{ marginTop: 14 }}>退会はマイページからいつでもできます。退会すると会員ページは見られなくなります。</p>
          </div>
          <p style={{ marginTop: 24 }}>
            <Link href="/course">もっと深めたい方へ：動画講座（全{SITE.lessonsCount}回）→</Link>
          </p>
        </section>
      </main>
      <footer>© {SITE.name}　運営：つっちー</footer>
    </>
  );
}
