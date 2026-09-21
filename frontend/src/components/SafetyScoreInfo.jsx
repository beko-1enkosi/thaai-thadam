export default function SafetyScoreInfo() {
  return (
    <details className="score-info">
      <summary>About safety scores</summary>
      <p>
        Scores consider lighting, street activity, places to wait, transport
        access, and community reports. Higher scores represent more supportive
        conditions in the example.
      </p>
      <p>
        These ratings are fixed illustrations, not live assessments or
        guarantees of safety. A working service would need validated local data
        and regular reviews.
      </p>
    </details>
  );
}
