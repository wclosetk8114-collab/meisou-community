import { createHash } from "crypto";
import { answerWithAI } from "@/lib/knowledge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const H = "a663dd23de9cf4f9dda9e65a595a1735b563276b8c93068d23cf419eb7097fec";

export async function GET(req: Request) {
  const u = new URL(req.url);
  if (createHash("sha256").update(u.searchParams.get("k") || "").digest("hex") !== H) return new Response("not found", { status: 404 });
  try {
    return Response.json({ ok: true, ...(await answerWithAI(u.searchParams.get("q") || "瞑想中に考えごとが止まりません")) });
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
