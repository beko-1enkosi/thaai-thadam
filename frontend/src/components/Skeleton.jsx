export function SkeletonText({ wide = false }) {
  return <span className={`skeleton skeleton-text${wide ? ' skeleton-wide' : ''}`} aria-hidden="true" />;
}
export function SkeletonCard() {
  return <div className="context-card skeleton-card" aria-hidden="true"><SkeletonText /><span className="skeleton skeleton-number" /><SkeletonText wide /></div>;
}
export default function SkeletonList({ label = 'Loading updates', count = 3 }) {
  return <div className="loading-content" role="status" aria-label={label}>
    <span className="sr-only">{label}</span>
    <div className="context-grid">{Array.from({length:count},(_,i)=><SkeletonCard key={i} />)}</div>
  </div>;
}
