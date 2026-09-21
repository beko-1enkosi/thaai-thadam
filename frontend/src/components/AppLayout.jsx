import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import BottomNavigation from "./BottomNavigation";
import Icon from "./Icon";
import { navigation } from "../data/navigation";

export default function AppLayout() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const mainRef = useRef(null);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
  }, [pathname]);

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="app-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Thaai Thadam home">
            <span className="brand-mark">
              <Icon name="footprint" size={27} />
            </span>
            <span>
              <span className="wordmark">
                Thaai <em>Thadam</em>
              </span>
              <span className="brand-meaning">Mother's Footprint</span>
            </span>
          </Link>
          <nav className="desktop-navigation" aria-label="Main navigation">
            {navigation.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink className="emergency-link" to="/emergency">
            <Icon name="shield" size={18} />
            <span>Emergency</span>
          </NavLink>
        </div>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>From the first step to the last.</span>
        <Link to="/about">About Thaai Thadam</Link>
        <span className="footer-note">
          Prototype &middot; Trichy, Tamil Nadu
        </span>
      </footer>
      <BottomNavigation />
    </div>
  );
}
