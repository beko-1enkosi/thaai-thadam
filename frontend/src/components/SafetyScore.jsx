import Icon from "./Icon";

export default function SafetyScore({ score }) {
  return (
    <div className="safety-score">
      <Icon name="shield" size={19} />
      <span>
        <strong>
          {score.toFixed(1)}
          <small>/10</small>
        </strong>
        <span>Safety score</span>
      </span>
    </div>
  );
}
