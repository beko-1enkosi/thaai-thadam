import { Link } from "react-router";
import Icon from "./Icon";

export default function QuickAction({
  to,
  icon,
  title,
  description,
  emergency = false,
}) {
  return (
    <Link
      className={`quick-action${emergency ? " quick-action-emergency" : ""}`}
      to={to}
    >
      <span className="action-icon">
        <Icon name={icon} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <Icon name="arrow" size={18} />
    </Link>
  );
}
