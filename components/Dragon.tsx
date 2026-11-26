import type { DragonKey } from "@/lib/dragon";

// オリジナルの「かわいい竜」。段階ごとに少しずつ育つ
export default function Dragon({ stage, size = 180 }: { stage: DragonKey; size?: number }) {
  const egg = stage === "egg" || stage === "crack";
  const order = ["egg", "crack", "baby", "child", "young", "adult", "light"].indexOf(stage);
  const body = "#a9d0f5", bodyD = "#7fb0e6", belly = "#fff6e4", wing = "#c9bdf2", horn = "#f3d58e", cheek = "#f7b8c8";
  const s = order >= 5 ? 1.12 : order === 4 ? 1.04 : 1; // 大きさ
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={`dragon dragon-${stage}`} aria-label="育つ竜">
      <defs>
        <radialGradient id="dgEgg" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ffffff" /><stop offset=".6" stopColor="#eaf3ff" /><stop offset="1" stopColor="#b9d6f5" /></radialGradient>
        <radialGradient id="dgAura" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff8d6" stopOpacity=".9" /><stop offset="1" stopColor="#b9d6f5" stopOpacity="0" /></radialGradient>
      </defs>
      {stage === "light" && <circle cx="100" cy="105" r="95" fill="url(#dgAura)" className="dg-aura" />}
      <ellipse cx="100" cy="182" rx={egg ? 38 : 48 * s} ry="7" fill="rgba(40,70,120,.12)" />

      {egg && (
        <g className="dg-wobble">
          <path d="M100 30 C140 30 158 95 158 125 C158 160 132 180 100 180 C68 180 42 160 42 125 C42 95 60 30 100 30 Z" fill="url(#dgEgg)" stroke="#9cc3ea" strokeWidth="2" />
          <circle cx="78" cy="95" r="9" fill="#cfe2fa" /><circle cx="120" cy="120" r="12" fill="#d9cdf5" /><circle cx="92" cy="150" r="7" fill="#cfe2fa" /><circle cx="128" cy="78" r="6" fill="#d9cdf5" />
          {stage === "crack" && <path d="M58 112 L74 102 L84 116 L98 100 L110 116 L124 104 L142 114" fill="none" stroke="#6f93c4" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
          {stage === "crack" && <circle cx="100" cy="108" r="40" fill="#fff8d6" opacity=".25" className="dg-glow" />}
        </g>
      )}

      {!egg && (
        <g transform={`translate(100 118) scale(${s}) translate(-100 -118)`} className="dg-float">
          {/* しっぽ */}
          {order >= 3 && <path d="M132 150 C165 152 172 128 160 118 C170 136 150 144 130 138 Z" fill={body} stroke={bodyD} strokeWidth="2" />}
          {order >= 4 && <path d="M160 118 l10 -8 l-2 12 z" fill={horn} />}
          {/* 翼 */}
          {order >= 3 && (
            <g className="dg-wing">
              <path d={order >= 4 ? "M72 112 C40 80 30 104 34 126 C46 118 56 124 70 128 Z" : "M74 116 C56 100 48 112 52 126 C60 122 66 126 74 128 Z"} fill={wing} stroke="#a796e0" strokeWidth="2" />
              <path d={order >= 4 ? "M128 112 C160 80 170 104 166 126 C154 118 144 124 130 128 Z" : "M126 116 C144 100 152 112 148 126 C140 122 134 126 126 128 Z"} fill={wing} stroke="#a796e0" strokeWidth="2" />
            </g>
          )}
          {/* からだ */}
          {order >= 3 && (
            <>
              <ellipse cx="100" cy="140" rx="34" ry="32" fill={body} stroke={bodyD} strokeWidth="2" />
              <ellipse cx="100" cy="146" rx="20" ry="20" fill={belly} />
              <ellipse cx="84" cy="168" rx="9" ry="6" fill={body} stroke={bodyD} strokeWidth="2" />
              <ellipse cx="116" cy="168" rx="9" ry="6" fill={body} stroke={bodyD} strokeWidth="2" />
            </>
          )}
          {/* 背中のトゲ */}
          {order >= 4 && <path d="M118 110 l8 -6 l-1 9 l8 -3 l-3 8" fill={horn} />}
          {/* 頭 */}
          <g transform={order === 2 ? "translate(0 16)" : undefined}>
            <path d={order >= 5 ? "M78 58 l-6 -22 l16 14 z M122 58 l6 -22 l-16 14 z" : "M82 60 l-4 -14 l12 9 z M118 60 l4 -14 l-12 9 z"} fill={horn} stroke="#d9b45e" strokeWidth="1.5" />
            {order >= 5 && <path d="M92 50 q8 -10 16 0" fill="none" stroke={horn} strokeWidth="4" strokeLinecap="round" />}
            <ellipse cx="100" cy="86" rx="36" ry="32" fill={body} stroke={bodyD} strokeWidth="2" />
            <ellipse cx="100" cy="98" rx="18" ry="11" fill={belly} />
            <circle cx="96" cy="97" r="1.6" fill={bodyD} /><circle cx="104" cy="97" r="1.6" fill={bodyD} />
            {/* 目 */}
            <g className="dg-eyes">
              <ellipse cx="86" cy="82" rx="6.5" ry="8" fill="#2a3557" /><ellipse cx="114" cy="82" rx="6.5" ry="8" fill="#2a3557" />
              <circle cx="88" cy="79" r="2.4" fill="#fff" /><circle cx="116" cy="79" r="2.4" fill="#fff" />
            </g>
            <ellipse cx="76" cy="94" rx="5" ry="3" fill={cheek} opacity=".8" /><ellipse cx="124" cy="94" rx="5" ry="3" fill={cheek} opacity=".8" />
            <path d="M95 104 q5 4 10 0" fill="none" stroke="#5d6f9c" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* うまれたて：卵のから */}
          {order === 2 && (
            <path d="M52 120 L64 110 L76 122 L90 108 L102 122 L116 108 L128 122 L140 110 L150 120 C152 160 132 180 100 180 C68 180 50 160 52 120 Z" fill="url(#dgEgg)" stroke="#9cc3ea" strokeWidth="2" />
          )}
        </g>
      )}
      {stage === "light" && (
        <g className="dg-stars" fill="#fff8d6">
          <path d="M30 50 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" /><path d="M170 40 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" /><path d="M164 150 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" />
        </g>
      )}
    </svg>
  );
}
