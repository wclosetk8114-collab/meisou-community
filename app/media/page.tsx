import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Banner from "@/components/Banner";
import { q } from "@/lib/db";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: `メディア｜${SITE.name}`, description: "瞑想と思想の記事、つっちーのラジオのまとめ。無料登録で全部読めます。" };

export default async function PublicMedia() {
  const posts = await q<any>("select id,kind,title,image_url,left(body,90) ex,to_char(created_at at time zone 'Asia/Tokyo','YYYY.MM.DD') d from meisou.posts where kind in ('article','radio') and published order by created_at desc").catch(() => []);
  return (
    <>
      <PublicHeader />
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <p className="en">MEDIA</p>
        <h1 style={{ fontSize: 30 }}>メディア</h1>
        <p className="muted">瞑想と思想の記事、つっちーのラジオのまとめ。登録なしでも途中まで、<Link href="/join-free">無料登録</Link>で全部読めます。</p>
        <div className="grid" style={{ marginTop: 18 }}>
          {posts.map((p: any) => (
            <Link key={p.id} href={`/media/${p.id}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
              <Banner id={p.id} title={p.title} image={p.image_url} small />
              <span className="muted" style={{ display: "block", marginTop: 12 }}>{p.kind === "radio" && <span className="tag gold" style={{ fontSize: 11, marginRight: 8 }}>ラジオ</span>}{p.d}</span>
              <h3>{p.title}</h3><p className="muted" style={{ margin: 0 }}>{p.ex}…</p>
            </Link>
          ))}
          {posts.length === 0 && <p className="muted">記事はまだありません。</p>}
        </div>
      </main>
    </>
  );
}
