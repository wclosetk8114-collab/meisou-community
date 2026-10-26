export default function Answer({ text, date }: { text: string; date?: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 12 }}>
      <img src="/tsuchii.jpg" alt="つっちー" width={44} height={44} style={{ borderRadius: "50%", flexShrink: 0, border: "1px solid var(--gold-l)", objectFit: "cover" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>つっちー</b> <span className="muted" style={{ fontSize: 12 }}>{date}</span></div>
        <div className="answer prose">{text}</div>
      </div>
    </div>
  );
}
