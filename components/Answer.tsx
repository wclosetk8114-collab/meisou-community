export default function Answer({ text, date, refs = [] }: { text: string; date?: string; refs?: { title: string; url: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 12 }}>
      <img src="/tsuchii.jpg" alt="つっちー" width={44} height={44} style={{ borderRadius: "50%", flexShrink: 0, border: "1px solid var(--gold-l)", objectFit: "cover" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>つっちー</b> <span className="muted" style={{ fontSize: 12 }}>{date}</span></div>
        <div className="answer prose">{text}</div>
        {refs.length > 0 && (
          <div style={{ marginTop: 10, fontSize: 13.5 }}>
            <span className="muted" style={{ fontSize: 12.5 }}>参考記事</span>
            {refs.map((r) => <div key={r.url}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
