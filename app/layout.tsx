import "./globals.css";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name}｜瞑想×思想コミュニティ`,
  description: `毎日の瞑想で静けさにもどり、視座をひらく、瞑想×思想の会員制コミュニティ。初月無料、2ヶ月目から期間限定 月額${SITE.monthly.toLocaleString()}円（税込）。`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Cormorant+Garamond:wght@500&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
