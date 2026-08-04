interface CoinIconProps {
  size?: number;
  className?: string;
}

export default function CoinIcon({ size = 16, className = "" }: CoinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
    >
      <circle cx="12" cy="12" r="10" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#D97706" strokeWidth="1.2" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#B45309"
        fontFamily="system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  );
}
