// 名前や価格はここを変えると全ページに反映されます
export const SITE = {
  name: "KUU",
  en: "KUU — MEDITATION COMMUNITY",
  tagline: "毎日、瞑想で静けさにもどる。そこから、視座がひらく。",
  monthly: 3980, // 税込・月額（期間限定価格）
  course: 50000, // 税別
  courseTaxIn: 55000,
  lessonsCount: 10,
  // 伴走プラン（3ヶ月・月2回オンライン・会員機能と動画講座込み）
  bansou: 100000, // 税別
  bansouTaxIn: 110000,
  bansouMonths: 3,
  bansouPerMonth: 2,
  // 会員向けLINEオープンチャット（会員ページだけに表示）
  openchat: "https://line.me/ti/g2/O0jG0dVL1dBCTZVCQ7psSwD3I8WQjSlBpR-Qtg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
  // 無料のLINEオープンチャット（イベント・最新情報。だれでも入れる）
  freeOpenchat: "https://line.me/ti/g2/JDZAsLhGeNsPmgRowt8w8ds2JzsKt7byFy3QZw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
  // Stripe の月額3,980円 決済リンク（入れると「会員になる」ボタンが決済に飛ぶ。空なら参加コード登録）
  payLink: "",
  // KUU公式LINE（運営への連絡窓口）
  line: "https://lin.ee/NlWRY0V",
  url: "https://meisou-community.vercel.app",
};
export const joinHref = () => SITE.payLink || "/signup";
export const yen = (n: number) => n.toLocaleString("ja-JP") + "円";
