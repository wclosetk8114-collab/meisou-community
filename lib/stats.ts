import { q, one } from "./db";

export async function myStats(memberId: string) {
  const days = await q<{ day: string }>(
    "select distinct to_char(day,'YYYY-MM-DD') as day from meisou.meditation_logs where member_id=$1 and day > (now() at time zone 'Asia/Tokyo')::date - 400 order by day desc", [memberId]);
  const set = new Set(days.map((d) => d.day));
  const today = await one<{ d: string }>("select to_char((now() at time zone 'Asia/Tokyo')::date,'YYYY-MM-DD') d");
  const t = new Date(today!.d + "T00:00:00Z");
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  let streak = 0;
  const cur = new Date(t);
  if (!set.has(fmt(cur))) cur.setUTCDate(cur.getUTCDate() - 1); // 今日まだでも昨日まで続いていればOK
  while (set.has(fmt(cur))) { streak++; cur.setUTCDate(cur.getUTCDate() - 1); }
  const total = await one<{ n: string; m: string }>("select count(distinct day) n, coalesce(sum(minutes),0) m from meisou.meditation_logs where member_id=$1", [memberId]);
  return { set, today: today!.d, doneToday: set.has(today!.d), streak, totalDays: Number(total?.n || 0), totalMin: Number(total?.m || 0) };
}
