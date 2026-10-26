// 動画・音声URLを埋め込み用に変換（YouTube / Vimeo / Googleドライブ / 直リンク）
export function videoEmbed(url: string): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (m) return { type: "iframe", src: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` };
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  if (m) return { type: "iframe", src: `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ""}` };
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return { type: "iframe", src: `https://drive.google.com/file/d/${m[1]}/preview` };
  return { type: "video", src: url };
}
export function audioEmbed(url: string): { type: "iframe" | "audio"; src: string } | null {
  if (!url) return null;
  const m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return { type: "iframe", src: `https://drive.google.com/file/d/${m[1]}/preview` };
  const v = videoEmbed(url);
  if (v && v.type === "iframe") return { type: "iframe", src: v.src };
  return { type: "audio", src: url };
}
