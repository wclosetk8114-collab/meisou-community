import { eggOf, type DragonKey } from "@/lib/dragon";

// AIイラストの竜（卵の種類で色がかわる）
export default function Dragon({ stage, size = 180, egg }: { stage: DragonKey; size?: number; egg?: string | null }) {
  const E = eggOf(egg);
  const isEgg = stage === "egg" || stage === "crack";
  return (
    <div className={`dragon dragon-${stage}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/dragon/${stage}.webp`} alt="育つ竜" width={size} height={size}
        className={isEgg ? "dg-wobble" : "dg-float"} style={{ filter: E.filter === "none" ? undefined : E.filter }} />
    </div>
  );
}
