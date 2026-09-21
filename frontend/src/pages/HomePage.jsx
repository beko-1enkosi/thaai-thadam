import { useEffect } from "react";
import { Link } from "react-router";
import Icon from "../components/Icon";
import QuickAction from "../components/QuickAction";
import DemoDataNotice from "../components/DemoDataNotice";
import { homeUpdates } from "../data/demoJourneys";

export default function HomePage() {
  useEffect(() => {
    document.title = "Home | Thaai Thadam";
  }, []);
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">
          <Icon name="pin" size={15} />
          TRICHY, TAMIL NADU
        </p>
        <h1>
          A little more confidence.
          <br />
          Every step of the way.
        </h1>
        <p>Welcome. Let&apos;s plan a safer journey through Trichy.</p>
      </div>
      <div className="home-grid">
        <section
          className="journey-entry"
          aria-labelledby="journey-entry-title"
        >
          <div className="section-kicker">
            <Icon name="journey" />
            YOUR NEXT JOURNEY
          </div>
          <h2 id="journey-entry-title">Where are you going?</h2>
          <p>Consider the walk, the wait, and the last mile.</p>
          <Link className="destination-entry" to="/journey">
            <Icon name="pin" />
            <span>Choose your destination</span>
            <Icon name="arrow" />
          </Link>
          <p className="suggestion-label">Explore a demo journey to</p>
          <div className="destination-chips">
            <Link to="/journey?to=chathiram">
              Chathiram Bus Stand <span aria-hidden="true">&#8599;</span>
            </Link>
            <Link to="/journey?to=junction">
              Trichy Junction <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
          <div className="entry-note">
            <Icon name="shield" size={17} />
            Compare sample routes with explained safety indicators.
          </div>
        </section>
        <section className="quick-actions" aria-labelledby="quick-title">
          <h2 id="quick-title">How can we help?</h2>
          <QuickAction
            to="/journey"
            icon="journey"
            title="Plan a safer journey"
            description="Compare demo route options"
          />
          <QuickAction
            to="/safe-hubs"
            icon="hub"
            title="Find a safe hub"
            description="Explore six demo waiting points"
          />
          <QuickAction
            to="/report"
            icon="report"
            title="Report an issue"
            description="Reporting is not available yet"
          />
          <QuickAction
            to="/emergency"
            icon="shield"
            title="Emergency help"
            description="Prototype only - No dispatch"
            emergency
          />
        </section>
      </div>
      <section className="local-context" aria-labelledby="context-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE LOCAL CONTEXT</p>
            <h2 id="context-title">Along the way</h2>
          </div>
          <span className="demo-label">Demo data</span>
        </div>
        <DemoDataNotice>
          Illustrative hub and community information. No live city data or
          current location is used.
        </DemoDataNotice>
        <div className="context-grid">
          {homeUpdates.map((item) => (
            <article className="context-card" key={item.title}>
              <span className="context-icon">
                <Icon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
          <article className="context-card reminder">
            <span className="context-icon">
              <Icon name="sun" />
            </span>
            <h3>Planning an evening trip?</h3>
            <p>
              Think ahead about your waiting point and the final walk. Check
              local conditions before you leave.
            </p>
            <span className="small-label">General travel reminder</span>
          </article>
        </div>
      </section>
    </>
  );
}
