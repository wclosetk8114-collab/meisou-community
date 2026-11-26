import type { Metadata } from "next";
import Countdown from "@/components/Countdown";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name}｜2026年12月1日 オープン`,
  description: "毎日、瞑想で静けさにもどる。そこから、視座がひらく。瞑想×思想の会員制コミュニティ KUU は 2026年12月1日にオープンします。",
};

export default function ComingSoon() {
  return (
    <main className="soon">
      <div className="soon-in">
        <div className="orbit"><span /><span /><span /><div className="sat"><i /></div></div>
        <p className="soon-logo">{SITE.name}</p>
        <p className="en">Coming soon</p>
        <h1><span>毎日、瞑想で</span><span>静けさにもどる。</span><br /><span>そこから、</span><span>視座がひらく。</span></h1>
        <p className="soon-date">2026.12.1 <small>OPEN</small></p>
        <Countdown to={SITE.releaseAt} />
        <p className="soon-text">瞑想×思想の会員制コミュニティ、まもなくはじまります。<br />オープンのお知らせは、無料オープンチャットで先にお届けします。</p>
        <div className="row" style={{ justifyContent: "center", gap: 12 }}>
          <a href={SITE.freeOpenchat} target="_blank" rel="noreferrer" className="btn">無料オープンチャットに入る</a>
          <a href={SITE.line} target="_blank" rel="noreferrer" className="btn ghost noarrow">KUU公式LINE</a>
        </div>
      </div>
      <footer style={{ color: "rgba(220,235,255,.6)", padding: "30px 0 40px" }}>© {SITE.en}</footer>
    </main>
  );
}
