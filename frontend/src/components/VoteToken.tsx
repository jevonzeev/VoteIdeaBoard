interface VoteTokenProps {
  isVoted: boolean;
  count: number;
  onClick?: () => void;
}

export function VoteToken({ isVoted, count, onClick }: VoteTokenProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        width: '68px',
        userSelect: 'none',
      }}
    >
      <svg width="68" height="68" viewBox="0 0 68 68" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="token-off-surface" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#2d303d" />
            <stop offset="65%" stopColor="#14151a" />
            <stop offset="100%" stopColor="#090a0d" />
          </radialGradient>

          <radialGradient id="token-on-surface" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#1b4d38" />
            <stop offset="65%" stopColor="#0a2118" />
            <stop offset="100%" stopColor="#030c08" />
          </radialGradient>

          <linearGradient id="shimmer-off" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          <linearGradient id="shimmer-on" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.6)" />
            <stop offset="40%" stopColor="rgba(16, 185, 129, 0.15)" />
            <stop offset="70%" stopColor="rgba(10, 33, 24, 0)" />
          </linearGradient>
        </defs>

        {/* Outer Ring - Fixed Stroke Width to prevent layout jump */}
        <circle
          cx="34"
          cy="34"
          r="31"
          fill={isVoted ? 'url(#token-on-surface)' : 'url(#token-off-surface)'}
          stroke={isVoted ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}
          strokeWidth="2"
        />

        {/* Inner Shimmer Overlay */}
        <circle
          cx="34"
          cy="34"
          r="29"
          fill={isVoted ? 'url(#shimmer-on)' : 'url(#shimmer-off)'}
        />

        {/* Embedded Coin Groove */}
        <circle
          cx="34"
          cy="34"
          r="25"
          fill="none"
          stroke={isVoted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0,0,0,0.6)'}
          strokeWidth="1.5"
        />

        {/* Single Neon Light Embedded Flag Icon */}
        <g transform="translate(23, 19)">
          <line
            x1="5"
            y1="5"
            x2="5"
            y2="25"
            stroke={isVoted ? '#10b981' : '#334155'}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: isVoted ? 'drop-shadow(0px 0px 3px #10b981)' : 'none' }}
          />
          <path
            d="M 5 6 C 9 3, 13 9, 19 6 L 19 16 C 13 19, 9 13, 5 16 Z"
            fill={isVoted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
            stroke={isVoted ? '#10b981' : '#475569'}
            strokeWidth="1.5"
            strokeLinejoin="round"
            style={{ filter: isVoted ? 'drop-shadow(0px 0px 4px #10b981)' : 'none' }}
          />
        </g>
      </svg>

      {/* Vote Count Badge */}
      <div
        style={{
          marginTop: '-8px',
          background: isVoted ? '#10b981' : '#0d0e12',
          color: isVoted ? '#04120a' : '#64748b',
          border: isVoted ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9px',
          padding: '1px 10px',
          fontSize: '10px',
          fontWeight: 800,
          zIndex: 2,
        }}
      >
        {count}
      </div>
    </div>
  );
}