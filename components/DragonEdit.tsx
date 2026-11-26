"use client";
import { useState, useTransition } from "react";
import { setDragon } from "@/app/actions/member";
import { EGGS } from "@/lib/dragon";
import Dragon from "./Dragon";

export default function DragonEdit({ name, egg, canEgg, open: initOpen = false }: { name: string; egg: string; canEgg: boolean; open?: boolean }) {
  const [open, setOpen] = useState(initOpen);
  const [nm, setNm] = useState(name);
  const [eg, setEg] = useState(egg);
  const [pending, start] = useTransition();
  if (!open) return <button type="button" className="btn ghost small" style={{ marginTop: 10 }} onClick={() => setOpen(true)}>{canEgg ? "名前・卵をえらぶ" : "名前をかえる"}</button>;
  return (
    <div style={{ marginTop: 12, textAlign: "left" }}>
      {canEgg && (
        <>
          <label>卵をえらぶ（うまれるまで変えられます）</label>
          <div className="egg-pick">
            {EGGS.map((e) => (
              <button type="button" key={e.key} className={eg === e.key ? "on" : ""} onClick={() => setEg(e.key)}>
                <Dragon stage="egg" egg={e.key} size={64} />
                <span>{e.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <label>竜の名前</label>
      <input value={nm} onChange={(e) => setNm(e.target.value)} maxLength={20} placeholder="例：くう" />
      <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
        <button type="button" className="btn small" disabled={pending} onClick={() => start(async () => { await setDragon(nm, eg); setOpen(false); })}>{pending ? "保存中…" : "きめる"}</button>
        <button type="button" className="btn ghost small" onClick={() => setOpen(false)}>とじる</button>
      </div>
    </div>
  );
}
