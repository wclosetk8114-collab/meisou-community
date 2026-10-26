// 名前や価格はここを変えると全ページに反映されます
export const SITE = {
  name: "KUU",
  en: "KUU — MEDITATION COMMUNITY",
  tagline: "毎日、瞑想をして頭をからっぽにする。そこから視座がひらく。",
  monthly: 3980, // 税込・月額
  course: 50000, // 税別
  courseTaxIn: 55000,
  lessonsCount: 10,
  // 会員向けLINEオープンチャット（会員ページだけに表示）
  openchat: "https://line.me/ti/g2/O0jG0dVL1dBCTZVCQ7psSwD3I8WQjSlBpR-Qtg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
};
export const yen = (n: number) => n.toLocaleString("ja-JP") + "円";
