// 記事のバナー。画像URLがあればその画像、なければ空・宇宙のバナーを自動で作る
const SKIES = [
  { bg: "linear-gradient(160deg,#0b1430 0%,#1d3a78 55%,#6d8fd0 100%)", star: true },  // 夜空
  { bg: "linear-gradient(170deg,#1f3f7a 0%,#5f8fd6 50%,#f2c9b8 100%)", star: false }, // 夜明け
  { bg: "linear-gradient(175deg,#3f78c8 0%,#8fbdf0 60%,#e8f3fd 100%)", star: false }, // 青空
  { bg: "linear-gradient(165deg,#241d4f 0%,#5a4f9c 50%,#e7a99a 100%)", star: true },  // 夕暮れ
];
const pick = (s: string) => (parseInt(s.replace(/[^0-9a-f]/gi, "").slice(-2), 16) || 0) % SKIES.length;

export default function Banner({ id, title, image, small = false }: { id: string; title: string; image?: string; small?: boolean }) {
  const box: React.CSSProperties = { position: "relative", width: "100%", aspectRatio: "1200 / 630", borderRadius: small ? 12 : 18, overflow: "hidden" };
  if (image) return <div style={box}><img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>;
  const sky = SKIES[pick(id)];
  return (
    <div style={{ ...box, background: sky.bg, color: "#fff" }} aria-label={title}>
      {sky.star && <div style={{ position: "absolute", inset: 0, opacity: .8,
        backgroundImage: "radial-gradient(1.4px 1.4px at 12% 22%,#fff,transparent),radial-gradient(1px 1px at 28% 68%,#fff,transparent),radial-gradient(1.6px 1.6px at 47% 14%,#fff,transparent),radial-gradient(1px 1px at 63% 40%,#fff,transparent),radial-gradient(1.3px 1.3px at 82% 18%,#fff,transparent),radial-gradient(1px 1px at 90% 72%,#fff,transparent),radial-gradient(1.2px 1.2px at 8% 82%,#fff,transparent),radial-gradient(1px 1px at 72% 86%,#fff,transparent)" }} />}
      <div style={{ position: "absolute", width: "70%", aspectRatio: "1", right: "-18%", top: "-35%", borderRadius: "50%", border: "1px solid rgba(255,255,255,.35)" }} />
      <div style={{ position: "absolute", width: "48%", aspectRatio: "1", right: "-7%", top: "-20%", borderRadius: "50%", border: "1px solid rgba(255,255,255,.25)" }} />
      <div style={{ position: "absolute", width: "9%", aspectRatio: "1", right: "24%", top: "30%", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#fff,rgba(255,255,255,.2) 70%)", boxShadow: "0 0 30px rgba(255,255,255,.6)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: small ? "0 6% 7%" : "0 7% 7%" }}>
        <span style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: "italic", letterSpacing: ".3em", fontSize: small ? 11 : 13, opacity: .85 }}>KUU MEDIA</span>
        <span style={{ fontFamily: '"Shippori Mincho","Yu Mincho",serif', fontWeight: 500, letterSpacing: ".06em", lineHeight: 1.5, fontSize: small ? "clamp(14px,2.4vw,17px)" : "clamp(18px,4.2vw,30px)", textShadow: "0 2px 18px rgba(0,0,0,.25)", marginTop: 4, textWrap: "balance" } as React.CSSProperties}>{title}</span>
      </div>
    </div>
  );
}
