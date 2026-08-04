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
  const showMarks = mood === "idle" || mood === "studying";

  return (
    <svg viewBox="0 0 220 170" className="w-full h-full overflow-visible">
      <g className={mood !== "sleeping" ? "cat-float" : undefined}>
        {/* rear/tail nub */}
        <circle cx="182" cy="98" r="24" fill="#FFFDF7" stroke={INK} strokeWidth="4" />

        {/* main blob body */}
        <ellipse cx="98" cy="103" rx="82" ry="52" fill="#FFFDF7" stroke={INK} strokeWidth="4" />

        {/* ears - small rounded nubs */}
        <path d="M 48 66 Q 42 44 64 58 Z" fill="#FFFDF7" stroke={INK} strokeWidth="3.5" />
        <path d="M 70 58 Q 74 34 94 52 Z" fill="#FFFDF7" stroke={INK} strokeWidth="3.5" />

        {/* expression tick marks */}
        {showMarks && (
          <>
            <path d="M 32 96 L 26 91 L 32 86" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            <path d="M 138 78 L 144 74 L 138 70" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            <path d="M 58 56 L 62 49 L 67 56" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* eyes */}
        {showSunglasses ? (
          <>
            <rect x="52" y="83" width="22" height="15" rx="6" fill="#111827" />
            <rect x="82" y="76" width="22" height="15" rx="6" fill="#111827" />
            <line x1="74" y1="88" x2="82" y2="84" stroke="#111827" strokeWidth="2.5" />
          </>
        ) : mood === "sleeping" ? (
          <>
            <path d="M 54 92 Q 63 98 72 92" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M 84 84 Q 93 90 102 84" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="65" cy="93" r="10" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="95" cy="85" r="10" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle className="cat-eye" cx="65" cy={mood === "studying" ? 97 : 93} r="3.4" fill={INK} />
            <circle className="cat-eye" cx="95" cy={mood === "studying" ? 89 : 85} r="3.4" fill={INK} />
          </>
        )}

        {/* nose + mouth */}
        <ellipse cx="80" cy="106" rx="2.5" ry="2" fill={INK} />
        {mood === "happy" ? (
          <path d="M 72 112 Q 80 122 90 112" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M 74 111 Q 80 116 87 111" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* skins */}
        {skin === "bowtie" && (
          <g>
            <path d="M 92 128 L 103 121 L 103 135 Z" fill="#DB2777" stroke={INK} strokeWidth="1.5" />
            <path d="M 114 128 L 103 121 L 103 135 Z" fill="#DB2777" stroke={INK} strokeWidth="1.5" />
            <rect x="100" y="124" width="6" height="8" rx="1.5" fill="#9D174D" />
          </g>
        )}
        {skin === "scarf" && (
          <path
            d="M 40 100 Q 78 122 118 96 L 118 108 Q 78 132 40 110 Z"
            fill="#0F766E"
            stroke="#0b5c50"
            strokeWidth="1.5"
          />
        )}
        {skin === "partyhat" && (
          <g>
            <path d="M 58 52 L 78 6 L 90 54 Z" fill="#7C3AED" stroke={INK} strokeWidth="2" />
            <circle cx="78" cy="6" r="5.5" fill="#FBBF24" stroke={INK} strokeWidth="1.5" />
          </g>
        )}
        {skin === "crown" && (
          <path
            d="M 48 56 L 54 26 L 68 44 L 81 20 L 94 44 L 100 56 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}
      </g>

      {mood === "studying" && (
        <g>
          <rect x="26" y="132" width="34" height="22" rx="2" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <line x1="43" y1="132" x2="43" y2="154" stroke={INK} strokeWidth="1.5" />
          <line x1="31" y1="138" x2="39" y2="138" stroke={INK} strokeWidth="1.2" />
          <line x1="31" y1="144" x2="39" y2="144" stroke={INK} strokeWidth="1.2" />
          <line x1="47" y1="138" x2="55" y2="138" stroke={INK} strokeWidth="1.2" />
          <line x1="47" y1="144" x2="55" y2="144" stroke={INK} strokeWidth="1.2" />
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
          <text x="40" y="55" fontSize="16" fill="#DB2777" className="cat-heart">
            ♥
          </text>
          <text x="90" y="35" fontSize="20" fill="#DB2777" className="cat-heart" style={{ animationDelay: "0.15s" }}>
            ♥
          </text>
          <text x="132" y="55" fontSize="14" fill="#DB2777" className="cat-heart" style={{ animationDelay: "0.3s" }}>
            ♥
          </text>
        </g>
      )}
    </svg>
  );
}
