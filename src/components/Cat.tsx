import type { SkinId } from "../petTypes";

export type CatMood = "idle" | "studying" | "sleeping" | "happy";

interface CatProps {
  mood: CatMood;
  skin: SkinId;
  happyBurstKey?: number;
}

const INK = "#2a2a2a";

export default function Cat({ mood, skin, happyBurstKey }: CatProps) {
  const showSunglasses = skin === "sunglasses";

  return (
    <svg viewBox="0 0 220 190" className="w-full h-full overflow-visible">
      <g className={mood !== "sleeping" ? "cat-float" : undefined}>
        {/* tail */}
        <path
          className="cat-tail"
          d="M 168 128 Q 196 112 184 78"
          fill="none"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* body */}
        <ellipse cx="105" cy="122" rx="72" ry="44" fill="#FFFDF7" stroke={INK} strokeWidth="4" />

        {/* ears */}
        <path d="M 52 80 Q 46 54 68 70 Z" fill="#FFFDF7" stroke={INK} strokeWidth="3.5" />
        <path d="M 84 72 Q 88 46 102 66 Z" fill="#FFFDF7" stroke={INK} strokeWidth="3.5" />

        {/* whiskers */}
        <line x1="34" y1="112" x2="12" y2="104" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="120" x2="10" y2="120" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="128" x2="12" y2="136" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

        {/* eyes */}
        {showSunglasses ? (
          <>
            <rect x="50" y="98" width="20" height="13" rx="5" fill="#111827" />
            <rect x="76" y="94" width="20" height="13" rx="5" fill="#111827" />
            <line x1="70" y1="103" x2="76" y2="100" stroke="#111827" strokeWidth="2.5" />
          </>
        ) : mood === "sleeping" ? (
          <>
            <path d="M 55 104 Q 61 109 67 104" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M 78 100 Q 85 105 92 100" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : mood === "studying" ? (
          <>
            <path d="M 56 108 Q 61 111 66 108" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M 79 104 Q 85 107 91 104" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle className="cat-eye" cx="61" cy="104" r="5" fill={INK} />
            <circle className="cat-eye" cx="84" cy="100" r="5" fill={INK} />
          </>
        )}

        {/* nose + mouth */}
        <path d="M 68 114 L 74 114 L 71 118 Z" fill={INK} />
        {mood === "happy" ? (
          <path d="M 63 120 Q 71 130 80 120" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M 65 119 Q 71 124 78 119" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* skins */}
        {skin === "bowtie" && (
          <g>
            <path d="M 85 140 L 96 133 L 96 147 Z" fill="#DB2777" stroke={INK} strokeWidth="1.5" />
            <path d="M 107 140 L 96 133 L 96 147 Z" fill="#DB2777" stroke={INK} strokeWidth="1.5" />
            <rect x="93" y="136" width="6" height="8" rx="1.5" fill="#9D174D" />
          </g>
        )}
        {skin === "scarf" && (
          <path
            d="M 42 104 Q 75 124 112 100 L 112 112 Q 75 134 42 114 Z"
            fill="#0F766E"
            stroke="#0b5c50"
            strokeWidth="1.5"
          />
        )}
        {skin === "partyhat" && (
          <g>
            <path d="M 68 58 L 90 14 L 100 60 Z" fill="#7C3AED" stroke={INK} strokeWidth="2" />
            <circle cx="90" cy="14" r="5.5" fill="#FBBF24" stroke={INK} strokeWidth="1.5" />
          </g>
        )}
        {skin === "crown" && (
          <path
            d="M 58 62 L 64 34 L 78 50 L 91 28 L 103 50 L 108 62 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}
      </g>

      {mood === "studying" && (
        <g>
          <rect x="42" y="150" width="34" height="22" rx="2" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <line x1="59" y1="150" x2="59" y2="172" stroke={INK} strokeWidth="1.5" />
          <line x1="47" y1="156" x2="55" y2="156" stroke={INK} strokeWidth="1.2" />
          <line x1="47" y1="162" x2="55" y2="162" stroke={INK} strokeWidth="1.2" />
          <line x1="63" y1="156" x2="71" y2="156" stroke={INK} strokeWidth="1.2" />
          <line x1="63" y1="162" x2="71" y2="162" stroke={INK} strokeWidth="1.2" />
        </g>
      )}

      {mood === "sleeping" && (
        <g>
          <text x="130" y="55" fontSize="14" fill={INK} className="cat-zzz" style={{ animationDelay: "0s" }}>
            z
          </text>
          <text x="140" y="42" fontSize="18" fill={INK} className="cat-zzz" style={{ animationDelay: "0.5s" }}>
            z
          </text>
          <text x="152" y="28" fontSize="22" fill={INK} className="cat-zzz" style={{ animationDelay: "1s" }}>
            z
          </text>
        </g>
      )}

      {mood === "happy" && (
        <g key={happyBurstKey}>
          <text x="50" y="60" fontSize="16" fill="#DB2777" className="cat-heart">
            ♥
          </text>
          <text x="95" y="45" fontSize="20" fill="#DB2777" className="cat-heart" style={{ animationDelay: "0.15s" }}>
            ♥
          </text>
          <text x="130" y="60" fontSize="14" fill="#DB2777" className="cat-heart" style={{ animationDelay: "0.3s" }}>
            ♥
          </text>
        </g>
      )}
    </svg>
  );
}
