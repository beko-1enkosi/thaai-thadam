import { NavLink } from "react-router";
import { navigation } from "../data/navigation";
import Icon from "./Icon";

export default function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Mobile navigation">
      {navigation.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <Icon name={icon} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
