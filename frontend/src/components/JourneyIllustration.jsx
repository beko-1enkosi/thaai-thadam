import Icon from './Icon';

export default function JourneyIllustration() {
  return <div className="journey-illustration" aria-hidden="true">
    <svg className="journey-trail" viewBox="0 0 440 320" fill="none"><path d="M30 266C145 276 82 145 197 167S362 235 328 105 414 29 414 29" stroke="currentColor" strokeWidth="2" strokeDasharray="5 9" /><circle cx="197" cy="167" r="75" stroke="currentColor" opacity=".12" /><circle cx="197" cy="167" r="120" stroke="currentColor" opacity=".1" /></svg>
    {[0,1,2,3,4,5].map(i=><span className={`trail-step step-${i}`} key={i}><Icon name="foot" size={28} /></span>)}
    <span className="trail-pin pin-one"><Icon name="pin" size={34} /></span>
    <span className="trail-pin pin-two"><Icon name="hub" size={30} /></span>
    <span className="trail-label label-one">A place to pause</span><span className="trail-label label-two">Your next step</span>
  </div>;
}
