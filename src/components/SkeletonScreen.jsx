export default function SkeletonScreen({ label = 'Loading Bharat HIE Portal…' }) {
  return (
    <div className="skeleton-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="sk-top">
        <div className="hie-skel sk-pill" />
        <div className="hie-skel sk-pill" style={{ flex: '0 0 140px', minWidth: 120 }} />
      </div>
      <div className="hie-skel sk-hero" />
      <div style={{ maxWidth: 1240, margin: '0 auto 18px' }}>
        <div className="hie-skel sk-line lg" />
        <div className="hie-skel sk-line" style={{ width: '88%' }} />
        <div className="hie-skel sk-line" style={{ width: '64%' }} />
      </div>
      <div className="sk-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="hie-skel sk-card" key={i} />
        ))}
      </div>
      <p className="sk-status">{label}</p>
    </div>
  );
}

export function NavSkeleton() {
  return (
    <div className="sk-nav-overlay" role="status" aria-live="polite">
      <div className="sk-nav-card">
        <div className="hie-skel sk-line lg" />
        <div className="hie-skel sk-line" style={{ width: '90%' }} />
        <div className="hie-skel sk-line" style={{ width: '70%' }} />
        <div className="sk-grid" style={{ marginTop: 14 }}>
          <div className="hie-skel sk-card" style={{ height: 72 }} />
          <div className="hie-skel sk-card" style={{ height: 72 }} />
        </div>
      </div>
    </div>
  );
}
