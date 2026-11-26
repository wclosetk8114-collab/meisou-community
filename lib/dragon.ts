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
