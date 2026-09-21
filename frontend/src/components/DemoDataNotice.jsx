export default function DemoDataNotice({ children, explainScores = false }) {
  return (
    <div className="demo-notice">
      <span className="demo-label">Demo data</span>
      <div>
        <p>{children}</p>
        {explainScores && (
          <details>
            <summary>How are the safety scores shown?</summary>
            <p>
              Scores out of 10 are fixed, illustrative ratings assigned to
              sample lighting, street activity, hub access, community reports,
              and transport indicators. They are not AI predictions, live
              municipal data, or a guarantee of safety.
            </p>
            <p>
              A production system would need validated real-world datasets,
              community and municipal information, and regular reviews. Sample
              routes, times, hub amenities, and transport availability have not
              been verified.
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
