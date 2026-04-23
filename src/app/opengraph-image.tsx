import { ImageResponse } from 'next/og';

export const alt = 'LOVELEEDAY Studios — Fixed price. Production code. Done in days.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#111111',
          padding: '72px 80px',
          fontFamily: 'serif',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <svg width="52" height="52" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="20" width="25" height="25" stroke="#F3F2EE" strokeWidth="2" />
            <rect x="55" y="20" width="25" height="25" fill="#F3F2EE" />
            <rect x="20" y="55" width="25" height="25" fill="#F3F2EE" />
            <path d="M55 55H80V80H55V55Z" stroke="#F3F2EE" strokeWidth="2" />
            <circle cx="67.5" cy="67.5" r="4" fill="#F3F2EE" />
          </svg>
        </div>

        {/* Main copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 600,
              color: '#F3F2EE',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              fontFamily: 'Georgia, serif',
            }}
          >
            LOVELEEDAY
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#9A9990',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Studios™
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#D4D2C9',
              marginTop: '16px',
              fontFamily: 'monospace',
              letterSpacing: '-0.01em',
            }}
          >
            Fixed price. Production code. Done in days.
          </div>
        </div>

        {/* Bottom tag */}
        <div
          style={{
            fontSize: '18px',
            color: '#5A5A55',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          loveleedaystudios.com
        </div>
      </div>
    ),
    { ...size }
  );
}
