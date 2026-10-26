"use client";
import { useEffect, useRef, useState } from "react";
import { logMeditation } from "@/app/actions/member";

function bell(ctx: AudioContext) {
  [528, 792].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25 / (i + 1), ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 4.2);
  });
}

export default function Timer() {
  const [len, setLen] = useState(10);
  const [left, setLeft] = useState(10 * 60);
  const [state, setState] = useState<"idle" | "run" | "pause" | "done">("idle");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [phase, setPhase] = useState("");
  const ctx = useRef<AudioContext | null>(null);
  const endAt = useRef(0);

  useEffect(() => {
    if (state !== "run") return;
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(s);
      const el = (Date.now() / 1000) % 10;
      setPhase(el < 5 ? "吸って" : "吐いて");
      if (s <= 0) { setState("done"); if (ctx.current) bell(ctx.current); }
    }, 250);
    return () => clearInterval(t);
  }, [state]);

  const start = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    bell(ctx.current);
    endAt.current = Date.now() + left * 1000;
    setState("run");
  };
  const pick = (n: number) => { setLen(n); setLeft(n * 60); setState("idle"); setSaved(false); };
  const save = async (minutes: number) => {
    await logMeditation(minutes, note);
    setSaved(true); setNote("");
  };
  const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
  const doneMin = Math.max(1, Math.round((len * 60 - left) / 60));

  return (
    <div className="card timer">
      <p className="en">Today&apos;s meditation</p>
      <div className={`orb ${state === "run" ? "run" : ""}`} />
      <div className="breath">{state === "run" ? phase : ""}</div>
      <div className="big">{mm}:{ss}</div>
      {state === "idle" && (
        <>
          <div className="chips">
            {[3, 5, 10, 15, 20, 30].map((n) => (
              <button key={n} className={`chip ${len === n ? "on" : ""}`} onClick={() => pick(n)}>{n}分</button>
            ))}
          </div>
          <div className="spacer" />
          <button className="btn" onClick={start}>はじめる</button>
          <p className="muted">吸って、吐いて。浮かんだことは、そのまま流します。</p>
        </>
      )}
      {state === "run" && <button className="btn ghost" onClick={() => setState("pause")}>一時停止</button>}
      {state === "pause" && (
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn" onClick={start}>つづける</button>
          <button className="btn ghost" onClick={() => setState("done")}>ここで終える</button>
        </div>
      )}
      {state === "done" && !saved && (
        <div style={{ textAlign: "left" }}>
          <p className="mincho" style={{ textAlign: "center", fontSize: 20 }}>おつかれさまでした</p>
          <label>ひとこと（みんなに表示されます・なくてもOK）</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="例：今日は呼吸がゆっくりになった" />
          <div className="spacer" />
          <button className="btn gold" style={{ width: "100%" }} onClick={() => save(doneMin)}>記録する（{doneMin}分）</button>
        </div>
      )}
      {saved && (
        <>
          <p className="ok">記録しました。今日もできましたね。</p>
          <button className="btn ghost small" onClick={() => pick(len)}>もう一度</button>
        </>
      )}
    </div>
  );
}
