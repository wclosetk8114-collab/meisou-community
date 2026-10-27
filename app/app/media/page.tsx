import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { q } from "@/lib/db";
import Banner from "@/components/Banner";

export default async function Media() {
  await requireMember();
  const posts = await q<any>("select id,title,image_url,left(body,90) ex,to_char(created_at at time zone 'Asia/Tokyo','YYYY.MM.DD') d from meisou.posts where kind='article' and published order by created_at desc");
  return (
    <>
      <p className="en">MEDIA</p>
      <h1 style={{ fontSize: 28 }}>メディア</h1>
      <p className="muted">会員だけが読める、瞑想と思想の記事です。</p>
      <div className="grid">
        {posts.map((p: any) => (
          <Link key={p.id} href={`/app/media/${p.id}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <Banner id={p.id} title={p.title} image={p.image_url} small />
            <span className="muted" style={{ display: "block", marginTop: 12 }}>{p.d}</span><h3>{p.title}</h3><p className="muted" style={{ margin: 0 }}>{p.ex}…</p>
          </Link>
        ))}
        {posts.length === 0 && <p className="muted">記事はまだありません。</p>}
      </div>
    </>
  );
}
