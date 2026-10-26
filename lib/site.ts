// 名前や価格はここを変えると全ページに反映されます
export const SITE = {
  name: "視座の森",
  en: "SHIZA NO MORI",
  tagline: "毎日、瞑想をして頭をからっぽにする。そこから視座がひらく。",
  monthly: 3980, // 税込・月額
  course: 50000, // 税別
  courseTaxIn: 55000,
  lessonsCount: 10,
};
export const yen = (n: number) => n.toLocaleString("ja-JP") + "円";
