"use client";
import { useEffect, useState } from "react";

export default function Countdown({ to }: { to: string }) {
  const target = Date.parse(to);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <div className="cd" style={{ visibility: "hidden" }}>&nbsp;</div>;
  const left = Math.max(0, target - now);
  const d = Math.floor(left / 86400000), h = Math.floor(left / 3600000) % 24, m = Math.floor(left / 60000) % 60, s = Math.floor(left / 1000) % 60;
  const cell = (n: number, l: string) => (
    <div><b>{String(n).padStart(2, "0")}</b><span>{l}</span></div>
  );
  return <div className="cd">{cell(d, "DAYS")}{cell(h, "HOURS")}{cell(m, "MIN")}{cell(s, "SEC")}</div>;
}
