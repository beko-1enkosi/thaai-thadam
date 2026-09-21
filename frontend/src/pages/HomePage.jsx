import { useEffect } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon';
import QuickAction from '../components/QuickAction';
import JourneyIllustration from '../components/JourneyIllustration';

export default function HomePage() {
  useEffect(() => { document.title = 'Home | Thaai Thadam'; }, []);
  return <>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow"><Icon name="pin" size={16} /> MADE FOR EVERYDAY TRICHY</p>
        <h1 id="home-title">Move with<br />more <em>confidence.</em></h1>
        <p>Plan safer journeys through Trichy.<br />A little more care, from the first step to the last.</p>
        <div className="hero-actions"><Link className="button button-primary" to="/journey">Plan a journey <Icon name="arrow" size={18} /></Link><Link className="hero-secondary" to="/safe-hubs">Explore safe hubs <Icon name="arrow" size={18} /></Link></div>
      </div>
      <JourneyIllustration />
      <div className="hero-caption"><span>THE WALK. THE WAIT. THE WAY HOME.</span><span>Mother&apos;s Footprint <Icon name="footprint" size={18} /></span></div>
    </section>
    <section className="journey-entry home-destination" aria-labelledby="journey-entry-title">
      <div><p className="eyebrow">YOUR NEXT JOURNEY</p><h2 id="journey-entry-title">Where are you going?</h2><p>Start with a place. We&apos;ll help you consider the way.</p></div>
      <div><Link className="destination-entry" to="/journey"><Icon name="pin" /><span>Choose your destination</span><Icon name="arrow" /></Link><div className="destination-chips"><Link to="/journey?to=chathiram">Chathiram Bus Stand <span aria-hidden="true">&#8599;</span></Link><Link to="/journey?to=junction">Trichy Junction <span aria-hidden="true">&#8599;</span></Link></div></div>
    </section>
    <section className="home-features" aria-labelledby="features-title">
      <div className="section-heading"><div><p className="eyebrow">A LITTLE SUPPORT GOES A LONG WAY</p><h2 id="features-title">For every part of your journey.</h2></div><span className="small-label">One place to plan, pause and connect.</span></div>
      <div className="feature-grid">
        <QuickAction to="/journey" icon="journey" title="Plan a safer journey" description="Compare routes and understand the safety factors." />
        <QuickAction to="/safe-hubs" icon="hub" title="Find safe hubs" description="Explore places to wait and the support they could offer." />
        <QuickAction to="/report" icon="report" title="Report an issue" description="Share a concern about your everyday journey." />
        <QuickAction to="/community" icon="community" title="Community insights" description="See the mobility concerns people are sharing." />
        <QuickAction to="/emergency" icon="shield" title="Emergency Help" description="Call for help or share your location with someone you trust." emergency />
      </div>
    </section>
    <section className="home-support" aria-labelledby="support-title"><div><p className="eyebrow">ALONG THE WAY</p><h2 id="support-title">The small things<br />make a difference.</h2><p>A well lit walk. A place to sit. Someone who knows where you are.</p></div><div className="support-steps"><p><Icon name="lighting" /><span><strong>Think about the whole journey</strong>Consider the walk, the waiting point and the final stretch.</span></p><p><Icon name="community" /><span><strong>Learn from shared experiences</strong>Community reports help bring everyday concerns into view.</span></p><Link className="hub-reference-link" to="/about">The idea behind Thaai Thadam <Icon name="arrow" size={18} /></Link></div></section>
  </>;
}
