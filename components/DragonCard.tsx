import Dragon from "./Dragon";
import DragonEdit from "./DragonEdit";
import { dragonOf, DRAGON_STAGES, eggOf, HATCH_MIN } from "@/lib/dragon";

export default function DragonCard({ totalMin, name, egg, compact = false }: { totalMin: number; name?: string | null; egg?: string | null; compact?: boolean }) {
  const d = dragonOf(totalMin);
  const E = eggOf(egg);
  const nm = name || "くう";
  const canEgg = totalMin < HATCH_MIN;
  return (
    <div className="card dragon-card" style={{ textAlign: "center" }}>
      <p className="label" style={{ justifyContent: "center", marginBottom: 0 }}>My dragon</p>
      <p className="mincho" style={{ margin: "2px 0 0", fontSize: 20 }}>{nm}</p>
      <Dragon stage={d.cur.key} egg={E.key} size={compact ? 140 : 180} />
      <h3 style={{ margin: "2px 0", fontSize: 15 }}>いまのすがた：{d.cur.name}{canEgg ? `（${E.name}）` : ""}</h3>
      <p className="muted" style={{ margin: "0 0 10px" }}>{d.cur.text}</p>
      {d.next ? (
        <>
          <div className="dg-bar"><i style={{ width: `${Math.round(d.progress * 100)}%` }} /></div>
          <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>あと<b>{d.toNext}分</b>の瞑想で、{nm}が「{d.next.name}」に育ちます（合計 {totalMin}分）</p>
        </>
      ) : <p className="muted" style={{ fontSize: 12.5 }}>最後のすがたまで育ちました（合計 {totalMin}分）</p>}
      {!compact && (
        <>
          <div className="dg-steps">
            {DRAGON_STAGES.map((s, i) => <span key={s.key} className={i <= d.index ? "on" : ""} title={`${s.name}（${s.min}分〜）`} />)}
          </div>
          <DragonEdit name={name || ""} egg={E.key} canEgg={canEgg} open={!egg && canEgg} />
        </>
      )}
    </div>
  );
}
