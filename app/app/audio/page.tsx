import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import { audioEmbed } from "@/lib/embed";

export default async function Audio() {
  await requireMember();
  const list = await q<any>("select *, to_char(created_at at time zone 'Asia/Tokyo','YYYY.MM.DD') d from meisou.posts where kind='audio' and published order by created_at desc");
  return (
    <>
      <p className="en">AUDIO</p>
      <h1 style={{ fontSize: 28 }}>音声</h1>
      <p className="muted">ガイド瞑想や話を、耳で聴けます。目を閉じたままどうぞ。</p>
      {list.length === 0 && <div className="card"><p className="muted">音声はまだありません。</p></div>}
      {list.map((p: any) => {
        const a = audioEmbed(p.media_url);
        return (
          <div className="card" key={p.id} style={{ marginBottom: 14 }}>
            <span className="muted">{p.d}</span>
            <h3>♪ {p.title}</h3>
            {a && (a.type === "audio" ? <audio controls preload="none" src={a.src} style={{ width: "100%" }} /> :
              <iframe src={a.src} style={{ width: "100%", height: 140, border: 0, borderRadius: 12 }} allow="autoplay" />)}
            {p.body && <p className="prose muted">{p.body}</p>}
          </div>
        );
      })}
    </>
  );
}
