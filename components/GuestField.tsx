"use client";
import { useEffect, useState } from "react";
import { guestLogs } from "./Timer";
export default function GuestField() {
  const [v, setV] = useState("[]"); const [n, setN] = useState(0);
  useEffect(() => { const l = guestLogs(); setV(JSON.stringify(l)); setN(l.reduce((a, x) => a + (Number(x.min) || 0), 0)); }, []);
  return <>
    <input type="hidden" name="guest" value={v} />
    {n > 0 && <p className="ok" style={{ fontSize: 13 }}>この端末で瞑想した {n}分の記録も引きつぎます。</p>}
  </>;
}
