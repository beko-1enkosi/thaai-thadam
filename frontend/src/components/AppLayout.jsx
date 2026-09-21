import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import AskThaai from "./assistant/AskThaai";
import SplashScreen from './SplashScreen';
import Footer from './Footer';
import PrototypeNotice from "./PrototypeNotice";
import BottomNavigation from "./BottomNavigation";
import Icon from "./Icon";
import { navigation } from "../data/navigation";

export default function AppLayout() {
  const { pathname, hash } = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    try { return sessionStorage.getItem('thaai-thadam:splash-seen') !== 'true'; }
    catch { return true; }
  });
  const finishSplash = useCallback(() => {
    try { sessionStorage.setItem('thaai-thadam:splash-seen', 'true'); } catch { /* Still dismiss when storage is blocked. */ }
    setShowSplash(false);
  }, []);
  const previousPath = useRef(pathname);
  const mainRef = useRef(null);
  const splashWasVisible = useRef(showSplash);
  useEffect(() => {
    if (!showSplash && splashWasVisible.current) mainRef.current?.focus();
    splashWasVisible.current = showSplash;
  }, [showSplash]);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!hash || showSplash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, showSplash]);

  return (
    <>
    {showSplash && <SplashScreen onFinish={finishSplash} />}
    <div className="app-layout" inert={showSplash}>
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
        <PrototypeNotice />
        <Outlet />
      </main>
      <Footer />
      <BottomNavigation />
    </div>
    {!showSplash && <AskThaai />}
    </>
  );
}
