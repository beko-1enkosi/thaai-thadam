import { useEffect } from 'react';
import { Link } from 'react-router';
import Icon from './Icon';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(onFinish, reduced ? 450 : 3000);
    return () => { clearTimeout(timer); document.body.style.overflow = previousOverflow; };
  }, [onFinish]);
  return <div className="splash-screen" aria-label="Welcome to Thaai Thadam">
    <div className="splash-center">
      <div className="walking-feet" aria-hidden="true"><Icon name="foot" size={64} /><Icon name="foot" size={64} /></div>
      <p className="splash-wordmark">Thaai <span>Thadam</span></p>
      <p>Mother&apos;s Footprint</p>
    </div>
    <div className="splash-actions"><button onClick={onFinish} autoFocus>Skip intro</button><Link to="/emergency" onClick={onFinish}>Emergency Help</Link></div>
  </div>;
}
