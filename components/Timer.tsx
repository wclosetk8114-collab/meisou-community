"use client";
import { useEffect, useRef, useState } from "react";
import { logMeditation } from "@/app/actions/member";
import { MOODS } from "@/lib/moods";

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

// 呼吸法（秒）
const BREATHS = [
  { key: "free", name: "ガイドなし", steps: [] as [string, number][] },
  { key: "slow", name: "ゆったり呼吸 5-5", steps: [["吸って", 5], ["吐いて", 5]] as [string, number][] },
  { key: "478", name: "4-7-8 呼吸", steps: [["吸って", 4], ["止めて", 7], ["吐いて", 8]] as [string, number][] },
  { key: "box", name: "ボックス呼吸 4-4-4-4", steps: [["吸って", 4], ["止めて", 4], ["吐いて", 4], ["止めて", 4]] as [string, number][] },
  { key: "long", name: "長く吐く 4-8", steps: [["吸って", 4], ["吐いて", 8]] as [string, number][] },
];

// ヒーリングミュージック（ブラウザ内で生成。著作権フリー）
const MUSICS = [
  { key: "none", name: "なし" },
  { key: "space", name: "宇宙の静けさ" },
  { key: "bowl", name: "シンギングボウル" },
  { key: "rain", name: "雨音" },
  { key: "wave", name: "波の音" },
  { key: "forest", name: "森とチャイム" },
  { key: "528", name: "528Hz ドローン" },
];

function noise(ctx: AudioContext, kind: "white" | "pink" | "brown") {
  const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  let last = 0, b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === "white") d[i] = w * 0.5;
    else if (kind === "brown") { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    else { b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048; d[i] = (b0 + b1 + b2 + w * 0.02) * 0.6; }
  }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
}

function startMusic(ctx: AudioContext, key: string, out: GainNode) {
  const nodes: AudioScheduledSourceNode[] = [];
  const timers: number[] = [];
  const osc = (f: number, type: OscillatorType, vol: number, dest: AudioNode = out) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = vol; o.connect(g).connect(dest); o.start(); nodes.push(o); return { o, g };
  };
  const lfo = (target: AudioParam, rate: number, depth: number) => {
    const l = ctx.createOscillator(), g = ctx.createGain(); l.frequency.value = rate; g.gain.value = depth; l.connect(g).connect(target); l.start(); nodes.push(l);
  };
  const strike = (f: number, vol: number, dur: number) => {
    [1, 2.76, 5.4].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); const t = ctx.currentTime;
      o.type = "sine"; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol / (i + 1.5), t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (i + 1));
      o.connect(g).connect(out); o.start(t); o.stop(t + dur);
    });
  };
  const filtered = (kind: "white" | "pink" | "brown", type: BiquadFilterType, freq: number, vol: number) => {
    const n = noise(ctx, kind), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = type; f.frequency.value = freq; g.gain.value = vol; n.connect(f).connect(g).connect(out); n.start(); nodes.push(n); return { f, g };
  };
  if (key === "space") {
    [110, 164.8, 220, 277.2].forEach((f, i) => { const { g } = osc(f, "sine", 0.05); lfo(g.gain, 0.05 + i * 0.03, 0.035); });
    osc(110.6, "sine", 0.04);
    filtered("pink", "lowpass", 500, 0.04);
  } else if (key === "bowl") {
    const notes = [196, 261.6, 293.7, 392];
    osc(98, "sine", 0.03);
    const ring = () => strike(notes[Math.floor(Math.random() * notes.length)], 0.22, 12);
    ring(); timers.push(window.setInterval(ring, 9000));
  } else if (key === "rain") {
    filtered("pink", "highpass", 900, 0.5);
    filtered("brown", "lowpass", 400, 0.35);
  } else if (key === "wave") {
    const { g } = filtered("brown", "lowpass", 700, 0.25);
    lfo(g.gain, 0.09, 0.22);
    const s2 = filtered("white", "bandpass", 1500, 0.03); lfo(s2.g.gain, 0.09, 0.03);
  } else if (key === "forest") {
    filtered("pink", "bandpass", 1200, 0.08);
    const scale = [523.3, 587.3, 659.3, 784, 880, 1046.5];
    const chime = () => { const f = scale[Math.floor(Math.random() * scale.length)];
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime; o.type = "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
      o.connect(g).connect(out); o.start(t); o.stop(t + 3.1); };
    timers.push(window.setInterval(() => { if (Math.random() < 0.6) chime(); }, 1800));
  } else if (key === "528") {
    const { g } = osc(528, "sine", 0.05); lfo(g.gain, 0.08, 0.02);
    osc(264, "sine", 0.05); osc(532, "sine", 0.015);
  }
  return () => { nodes.forEach((n) => { try { n.stop(); } catch {} }); timers.forEach((t) => clearInterval(t)); };
}

export default function Timer() {
  const [len, setLen] = useState(10);
  const [left, setLeft] = useState(10 * 60);
  const [state, setState] = useState<"idle" | "run" | "pause" | "done">("idle");
  const [note, setNote] = useState("");
  const [change, setChange] = useState("");
  const [mood, setMood] = useState("");
  const [saved, setSaved] = useState(false);
  const [phase, setPhase] = useState("");
  const [breath, setBreath] = useState("slow");
  const [music, setMusic] = useState("none");
  const [vol, setVol] = useState(0.6);
  const [scale, setScale] = useState(1);
  const ctx = useRef<AudioContext | null>(null);
  const endAt = useRef(0);
  const startAt = useRef(0);
  const master = useRef<GainNode | null>(null);
  const stopMusic = useRef<null | (() => void)>(null);

  const fadeOut = () => {
    const c = ctx.current, m = master.current, stop = stopMusic.current;
    stopMusic.current = null;
    if (!c || !m || !stop) return;
    m.gain.cancelScheduledValues(c.currentTime);
    m.gain.setValueAtTime(m.gain.value, c.currentTime);
    m.gain.linearRampToValueAtTime(0, c.currentTime + 3);
    setTimeout(stop, 3200);
  };
  useEffect(() => { if (master.current && ctx.current && stopMusic.current) master.current.gain.setTargetAtTime(vol * 0.8, ctx.current.currentTime, 0.2); }, [vol]);
  useEffect(() => () => { stopMusic.current?.(); }, []);

  useEffect(() => {
    if (state !== "run") return;
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(s);
      const b = BREATHS.find((x) => x.key === breath)!;
      if (b.steps.length) {
        const cyc = b.steps.reduce((a, x) => a + x[1], 0);
        let el = ((Date.now() - startAt.current) / 1000) % cyc;
        for (const [label, sec] of b.steps) {
          if (el < sec) {
            setPhase(`${label}… ${Math.ceil(sec - el)}`);
            const r = el / sec;
            setScale(label === "吸って" ? 0.8 + 0.4 * r : label === "吐いて" ? 1.2 - 0.4 * r : -1);
            break;
          }
          el -= sec;
        }
      } else { setPhase(""); setScale(1); }
      if (s <= 0) { setState("done"); fadeOut(); if (ctx.current) bell(ctx.current); }
    }, 250);
    return () => clearInterval(t);
  }, [state, breath]);

  const start = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const c = ctx.current;
    if (c.state === "suspended") c.resume();
    bell(c);
    if (music !== "none" && !stopMusic.current) {
      const m = c.createGain(); m.gain.setValueAtTime(0, c.currentTime); m.gain.linearRampToValueAtTime(vol * 0.8, c.currentTime + 4); m.connect(c.destination);
      master.current = m; stopMusic.current = startMusic(c, music, m);
    }
    endAt.current = Date.now() + left * 1000;
    startAt.current = Date.now();
    setState("run");
  };
  const pick = (n: number) => { fadeOut(); setLen(n); setLeft(n * 60); setState("idle"); setSaved(false); };
  const save = async (minutes: number) => {
    await logMeditation(minutes, note, change, mood);
    setSaved(true); setNote(""); setChange(""); setMood("");
  };
  const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
  const doneMin = Math.max(1, Math.round((len * 60 - left) / 60));

  return (
    <div className="card timer">
      <p className="en">Today&apos;s meditation</p>
      <div className={`orb ${state === "run" && breath === "free" ? "run" : ""}`} style={state === "run" && breath !== "free" && scale > 0 ? { transform: `scale(${scale})`, transition: "transform .3s linear", animation: "none" } : undefined} />
      <div className="breath">{state === "run" ? phase : ""}</div>
      <div className="big">{mm}:{ss}</div>
      {state === "idle" && (
        <>
          <div className="chips">
            {[3, 5, 10, 15, 20, 30, 45, 60, 90].map((n) => (
              <button key={n} className={`chip ${len === n ? "on" : ""}`} onClick={() => pick(n)}>{n}分</button>
            ))}
          </div>
          <div className="tm-opts">
            <label>呼吸法</label>
            <div className="chips">
              {BREATHS.map((b) => <button key={b.key} className={`chip ${breath === b.key ? "on" : ""}`} onClick={() => setBreath(b.key)}>{b.name}</button>)}
            </div>
            <label>ヒーリングミュージック</label>
            <div className="chips">
              {MUSICS.map((x) => <button key={x.key} className={`chip ${music === x.key ? "on" : ""}`} onClick={() => setMusic(x.key)}>{x.name}</button>)}
            </div>
            {music !== "none" && (
              <div className="row" style={{ justifyContent: "center", gap: 8 }}>
                <span className="muted" style={{ fontSize: 13 }}>音量</span>
                <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} style={{ width: 160 }} />
              </div>
            )}
            <p className="muted" style={{ fontSize: 12 }}>音楽は終了の3秒前からやさしく消えます。イヤホン推奨。</p>
          </div>
          <div className="spacer" />
          <button className="btn" onClick={start}>はじめる</button>
          <p className="muted">吸って、吐いて。浮かんだことは、そのまま流します。</p>
        </>
      )}
      {state === "run" && (
        <>
          {music !== "none" && (
            <div className="row" style={{ justifyContent: "center", gap: 8, marginBottom: 10 }}>
              <span className="muted" style={{ fontSize: 13 }}>音量</span>
              <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} style={{ width: 140 }} />
            </div>
          )}
          <button className="btn ghost" onClick={() => { setState("pause"); ctx.current?.suspend(); }}>一時停止</button>
        </>
      )}
      {state === "pause" && (
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn" onClick={start}>つづける</button>
          <button className="btn ghost" onClick={() => { ctx.current?.resume(); fadeOut(); setState("done"); }}>ここで終える</button>
        </div>
      )}
      {state === "done" && !saved && (
        <div style={{ textAlign: "left" }}>
          <p className="mincho" style={{ textAlign: "center", fontSize: 20 }}>おつかれさまでした</p>
          <label>いまの感じ（自分だけに見えます）</label>
          <div className="chips" style={{ justifyContent: "flex-start" }}>
            {MOODS.map((x) => (
              <button key={x} type="button" className={`chip ${mood === x ? "on" : ""}`} onClick={() => setMood(mood === x ? "" : x)}>{x}</button>
            ))}
          </div>
          <label>気づいた変化・感じたこと（自分だけに見えます）</label>
          <textarea value={change} onChange={(e) => setChange(e.target.value)} maxLength={2000} style={{ minHeight: 90 }} placeholder="例：始める前はイライラしていたけど、終わったら少し落ち着いた" />
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
