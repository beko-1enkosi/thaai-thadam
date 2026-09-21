import { useEffect } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon';
export default function AboutPage() {
  useEffect(() => { document.title = 'About | Thaai Thadam'; }, []);
  return <>
    <div className="page-heading"><p className="eyebrow">MOTHER&apos;S FOOTPRINT</p><h1>Care that moves with you.</h1><p>Thaai Thadam brings a little more thought and support to everyday mobility for women in Trichy.</p></div>
    <section className="about-story page"><Icon name="footprint" size={52} /><h2>Every journey is more than a destination.</h2><p>The walk to a bus stop, the wait for a ride and the last stretch home all shape how a journey feels. Thaai Thadam means Mother&apos;s Footprint: a reminder of care, confidence and the people who help us move forward.</p><p>Explore journey options, places to pause, community concerns and practical emergency tools in one place. The aim is to make local mobility information easier to understand and use.</p><Link className="button button-primary" to="/journey">Plan your next journey</Link></section>
    <section className="page about-contact" id="contact"><h2>Contact</h2><p>A public contact channel has not been published yet. To share a mobility concern, use <Link to="/report">Report an issue</Link>. For urgent help, open <Link to="/emergency">Emergency Help</Link>.</p></section>
  </>;
}
