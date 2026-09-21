import { Link } from 'react-router';
import Icon from './Icon';
import { navigation } from '../data/navigation';

export default function Footer() {
  return <footer className="app-footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <Link className="brand" to="/"><span className="brand-mark"><Icon name="footprint" size={32} /></span><span><span className="wordmark">Thaai <em>Thadam</em></span><span className="brand-meaning">Mother&apos;s Footprint</span></span></Link>
        <p>More care in every journey.<br />For women moving through Trichy.</p>
      </div>
      <nav aria-label="Footer navigation">{[...navigation, {to:'/emergency',label:'Emergency'}, {to:'/about',label:'About'}, {to:'/about#contact',label:'Contact'}].map(item=><Link key={item.to} to={item.to}>{item.label}</Link>)}</nav>
      <div className="footer-closing"><span>Safer journeys. Stronger communities.</span><span>Trichy, Tamil Nadu</span></div>
    </div>
  </footer>;
}
