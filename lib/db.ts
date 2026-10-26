import { Pool } from "pg";

const urls = (process.env.DATABASE_URLS || process.env.DATABASE_URL || "").split(",").map((s) => s.trim()).filter(Boolean);
let pool: Pool | null = null;
let idx = 0;

function makePool(i: number) {
  return new Pool({ connectionString: urls[i], ssl: { rejectUnauthorized: false }, max: 3, connectionTimeoutMillis: 6000 });
}

export async function q<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!urls.length) throw new Error("DATABASE_URLS が未設定です");
  for (let tries = 0; tries < urls.length; tries++) {
    if (!pool) pool = makePool(idx);
    try {
      const r = await pool.query(text, params);
      return r.rows as T[];
    } catch (e: any) {
      const conn = /ENOTFOUND|ECONNREFUSED|timeout|Tenant or user not found|terminat/i.test(String(e?.message));
      if (!conn) throw e;
      try { await pool.end(); } catch {}
      pool = null;
      idx = (idx + 1) % urls.length;
    }
  }
  throw new Error("データベースに接続できませんでした");
}
export async function one<T = any>(text: string, params: any[] = []) {
  const r = await q<T>(text, params);
  return r[0] ?? null;
}
