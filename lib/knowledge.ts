// 質問に答えるときの参考資料（プロジェクトの記事＋i.mediaの記事）
import { q } from "./db";

export type Doc = { id: string; source: string; title: string; body: string; url: string };

const norm = (s: string) => s.toLowerCase().replace(/[\s、。！？!?「」『』（）()・──…"'“”,.:：;；\-|＊*■]/g, "");
// 日本語でも効くように 2文字ずつに分けて比べる
function grams(s: string) {
  const t = norm(s), out = new Map<string, number>();
  for (let i = 0; i < t.length - 1; i++) { const g = t.slice(i, i + 2); out.set(g, (out.get(g) || 0) + 1); }
  return out;
}
const STOP = new Set(["ので", "ます", "です", "した", "して", "こと", "ても", "ない", "いる", "ある", "ょう", "でし", "すか", "ませ", "せん", "とき", "まう", "しま", "って", "てい", "とい", "いう", "ような", "よう", "ください", "くだ", "さい"]);

export async function relatedDocs(question: string, n = 5): Promise<(Doc & { score: number })[]> {
  const qg = [...grams(question).keys()].filter((g) => !STOP.has(g));
  if (!qg.length) return [];
  const docs = await q<Doc>("select id, source, title, body, url from meisou.knowledge");
  const scored = docs.map((d) => {
    const tg = grams(d.title), bg = grams(d.body);
    let s = 0;
    for (const g of qg) { if (tg.has(g)) s += 3; if (bg.has(g)) s += Math.min(3, Math.log2(1 + (bg.get(g) || 0))); }
    return { ...d, score: s / Math.sqrt(qg.length) };
  });
  return scored.filter((d) => d.score > 0).sort((a, b) => b.score - a.score).slice(0, n);
}

export const stripHtml = (h: string) =>
  h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(p|h[1-6]|li|div|blockquote)>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&#8217;/g, "'")
    .replace(/&#8212;/g, "—").replace(/&#8230;/g, "…").replace(/&#8220;|&#8221;/g, '"').replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/\n{3,}/g, "\n\n").trim();

const IMEDIA = "https://iii-iii.com/i.media";

/** i.media（WordPress）の記事を全部取り込む。同じURLは上書き */
export async function importImedia() {
  const items: { title: string; body: string; url: string }[] = [];
  // まず WordPress の API
  for (let page = 1; page <= 30; page++) {
    const r = await fetch(`${IMEDIA}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=link,title,content`, { cache: "no-store" }).catch(() => null);
    if (!r || !r.ok) break;
    const arr = await r.json().catch(() => null);
    if (!Array.isArray(arr) || !arr.length) break;
    for (const p of arr) items.push({ title: stripHtml(p.title?.rendered || ""), body: stripHtml(p.content?.rendered || ""), url: p.link });
    if (arr.length < 100) break;
  }
  // APIが使えないときは RSS をページ送りで
  if (!items.length) {
    for (let page = 1; page <= 40; page++) {
      const r = await fetch(`${IMEDIA}/feed/${page > 1 ? `?paged=${page}` : ""}`, { cache: "no-store" }).catch(() => null);
      if (!r || !r.ok) break;
      const xml = await r.text();
      const found = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
      if (!found.length) break;
      let added = 0;
      for (const it of found) {
        const pick = (tag: string) => (it.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)) || [])[1] || "";
        const un = (s: string) => s.replace(/^<!\[CDATA\[|\]\]>$/g, "");
        const url = un(pick("link")).trim();
        if (items.some((x) => x.url === url)) continue;
        items.push({ title: stripHtml(un(pick("title"))), body: stripHtml(un(pick("content:encoded")) || un(pick("description"))), url });
        added++;
      }
      if (!added) break;
    }
  }
  for (const it of items) {
    if (!it.url || !it.title) continue;
    await q(
      `insert into meisou.knowledge (source,title,body,url) values ('imedia',$1,$2,$3)
       on conflict (url) where url<>'' do update set title=excluded.title, body=excluded.body`,
      [it.title, it.body, it.url]);
  }
  return items.length;
}

/** AIで回答の下書きを作る（つっちーが直してから出す前提） */
export async function draftWithAI(question: string, docs: Doc[]) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY が未設定です");
  const ctx = docs.map((d, i) => `【資料${i + 1}】${d.title}\n${d.body.slice(0, 3500)}`).join("\n\n");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      max_tokens: 1200,
      system: "あなたは瞑想コミュニティ「視座の森」の運営者つっちーの回答下書きを書く係です。会員からの瞑想の質問に、つっちー本人の口調（やさしく、短い文、ふつうの言葉、専門用語は言い換える）で答えます。参考資料（虚次元・村主悠真さんの考え方の記事）の考え方を土台にしますが、資料に無いことは断定しない。資料名や「資料によると」は書かない。医療的な判断はしない。300〜500字。最後に、今日できる小さな一歩を1つ。",
      messages: [{ role: "user", content: `参考資料:\n${ctx}\n\n会員の質問:\n${question}\n\n回答の下書き:` }],
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error?.message || `AIの呼び出しに失敗しました（${r.status}）`);
  return (j.content || []).map((c: any) => c.text || "").join("").trim();
}
