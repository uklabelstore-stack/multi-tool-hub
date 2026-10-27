export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 42%, #60a5fa 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 28,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          padding: '18px 28px',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.28)',
          backdropFilter: 'blur(8px)',
          marginBottom: 24,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 1,
            color: '#f8fafc',
          }}
        >
          AI90s.site
        </span>
      </div>
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.05em',
          textAlign: 'center',
          color: '#f8fafc',
          maxWidth: 980,
          padding: '0 48px',
        }}
      >
        100+ Free Online Tools
      </div>
      <div
        style={{
          fontSize: 24,
          color: '#dbeafe',
          marginTop: 20,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        FAST • SIMPLE • MOBILE READY
      </div>
    </div>
  );
}
