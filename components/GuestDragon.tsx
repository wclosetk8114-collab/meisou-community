"use client";
import { useEffect, useState } from "react";
import Dragon from "./Dragon";
import { dragonOf } from "@/lib/dragon";
import { guestLogs } from "./Timer";

// 登録なしで使う人の竜（この端末の記録で育つ）
export default function GuestDragon() {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const f = () => setTotal(guestLogs().reduce((a, l) => a + (Number(l.min) || 0), 0));
    f(); window.addEventListener("kuu-guest", f); return () => window.removeEventListener("kuu-guest", f);
  }, []);
  const d = dragonOf(total);
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <p className="label" style={{ justifyContent: "center", marginBottom: 0 }}>My dragon</p>
      <Dragon stage={d.cur.key} size={160} />
      <h3 style={{ margin: "2px 0", fontSize: 15 }}>いまのすがた：{d.cur.name}</h3>
      <p className="muted" style={{ margin: "0 0 10px" }}>{d.cur.text}</p>
      {d.next && <>
        <div className="dg-bar"><i style={{ width: `${Math.round(d.progress * 100)}%` }} /></div>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>あと<b>{d.toNext}分</b>の瞑想で「{d.next.name}」に（この端末の合計 {total}分）</p>
      </>}
      <a href="/join-free" className="btn small" style={{ marginTop: 10 }}>無料登録して、竜に名前をつける</a>
      <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>登録すると、この端末の記録もそのまま引きつげます。</p>
    </div>
  );
}
