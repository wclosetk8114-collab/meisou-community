import { createHash } from "crypto";
import { importImedia } from "@/lib/knowledge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const H = "a663dd23de9cf4f9dda9e65a595a1735b563276b8c93068d23cf419eb7097fec";

export async function GET(req: Request) {
  const k = new URL(req.url).searchParams.get("k") || "";
  if (createHash("sha256").update(k).digest("hex") !== H) return new Response("not found", { status: 404 });
  try {
    const n = await importImedia();
    return Response.json({ ok: true, n });
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
