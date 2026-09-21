import { NavLink, Outlet } from 'react-router';

const navigation = [
  ['/', 'Home'],
  ['/journey', 'Journey'],
  ['/safe-hubs', 'Safe hubs'],
  ['/report', 'Report'],
  ['/community', 'Community'],
  ['/emergency', 'Emergency'],
  ['/about', 'About'],
];

export default function AppLayout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="app-header">
        <NavLink className="brand" to="/">Thaai Thadam</NavLink>
        <p>Mother’s Footprint · Trichy</p>
        <nav aria-label="Main navigation">
          {navigation.map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'}>{label}</NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <footer>Hackathon prototype · Features are under development.</footer>
    </div>
  );
}
