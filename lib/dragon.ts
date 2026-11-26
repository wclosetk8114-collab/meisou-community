// 瞑想した合計時間（分）で育つ竜
export const DRAGON_STAGES = [
  { min: 0, key: "egg", name: "たまご", text: "あたたかい卵。瞑想するたびに、なかで何かが育っています。" },
  { min: 10, key: "crack", name: "ひびの入った卵", text: "コツ…コツ…。なかから小さな音がきこえます。" },
  { min: 30, key: "baby", name: "うまれたての竜", text: "卵から顔を出しました。まだ眠たそう。" },
  { min: 120, key: "child", name: "こども竜", text: "小さな翼でぱたぱた。あなたの静けさが好きみたい。" },
  { min: 300, key: "young", name: "わかもの竜", text: "翼が大きくなって、空を見上げるようになりました。" },
  { min: 600, key: "adult", name: "おとなの竜", text: "堂々としたすがた。あなたと一緒に空をとびます。" },
  { min: 1200, key: "light", name: "光の竜", text: "宇宙の光をまとった竜。どこまでも広がっていきます。" },
] as const;

export type DragonKey = (typeof DRAGON_STAGES)[number]["key"];

export function dragonOf(totalMin: number) {
  let i = 0;
  DRAGON_STAGES.forEach((s, idx) => { if (totalMin >= s.min) i = idx; });
  const cur = DRAGON_STAGES[i];
  const next = DRAGON_STAGES[i + 1] || null;
  const progress = next ? Math.min(1, (totalMin - cur.min) / (next.min - cur.min)) : 1;
  return { index: i, cur, next, progress, toNext: next ? next.min - totalMin : 0 };
}

// 卵の種類（色でちがう竜が生まれる）
export const EGGS = [
  { key: "sora", name: "そらの卵", filter: "none", egg: ["#ffffff", "#eaf3ff", "#b9d6f5"], spot: ["#cfe2fa", "#d9cdf5"], body: "#a9d0f5", bodyD: "#7fb0e6", wing: "#c9bdf2", wingD: "#a796e0" },
  { key: "sakura", name: "さくらの卵", filter: "hue-rotate(135deg) saturate(1.15)", egg: ["#ffffff", "#fff0f4", "#f6c3d2"], spot: ["#fbd5e0", "#ffe7c7"], body: "#f8c6d5", bodyD: "#e89ab2", wing: "#ffe2b8", wingD: "#eab97a" },
  { key: "mori", name: "もりの卵", filter: "hue-rotate(-80deg) saturate(1.05)", egg: ["#ffffff", "#eefaf0", "#bfe3c6"], spot: ["#cdebd3", "#f3e6b5"], body: "#b5e2bf", bodyD: "#84c493", wing: "#f3e3a6", wingD: "#d4bd6a" },
  { key: "hoshi", name: "ほしの卵", filter: "hue-rotate(40deg) saturate(1.5) brightness(.9)", egg: ["#f4f0ff", "#c9c1f2", "#5d58a8"], spot: ["#fff6c9", "#ffffff"], body: "#8f8ae0", bodyD: "#6460b8", wing: "#f5d98f", wingD: "#d6b55c" },
  { key: "taiyo", name: "たいようの卵", filter: "hue-rotate(-165deg) saturate(1.4) brightness(1.03)", egg: ["#ffffff", "#fff6dc", "#f6cf7c"], spot: ["#ffe2a1", "#ffc9a6"], body: "#ffd78a", bodyD: "#e7b04f", wing: "#ffb9a0", wingD: "#e88d6d" },
] as const;
export type EggKey = (typeof EGGS)[number]["key"];
export function eggOf(key?: string | null) { return EGGS.find((e) => e.key === key) || EGGS[0]; }
export const HATCH_MIN = 30;
