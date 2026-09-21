import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import SkeletonList from "../components/Skeleton";
import { reportAreas, reportCategories } from "../data/reportOptions";
import { getCommunityReports } from "../services/community";

const categoryLabels = Object.fromEntries(
  reportCategories.map((category) => [category.value, category.label]),
);
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

export default function CommunityPage() {
  const [data, setData] = useState(null);
  const [phase, setPhase] = useState("loading");
  const [refresh, setRefresh] = useState(0);
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const categoryRef = useRef(null);

  useEffect(() => {
    document.title = "Community | Thaai Thadam";
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setPhase("loading");
    getCommunityReports(controller.signal)
      .then((result) => {
        if (active) {
          setData(result);
          setPhase("ready");
        }
      })
      .catch(() => {
        if (active) setPhase("error");
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [refresh]);

  const reports = data?.reports || [];
  const summary = data?.summary;
  const visibleReports = reports.filter(
    (report) =>
      (!category || report.category === category) &&
      (!area || report.area === area),
  );
  const highestCount = summary?.by_category[0]?.count;
  const topCategories =
    summary?.by_category.filter((item) => item.count === highestCount) || [];
  const mostReported =
    topCategories.length === 1
      ? categoryLabels[topCategories[0].category]
      : topCategories.length > 1
        ? `${topCategories.length} concerns tied`
        : "None yet";

  function clearFilters() {
    setCategory("");
    setArea("");
    categoryRef.current?.focus();
  }

  return (
    <>
      <div className="page-heading">
        <h1>Community safety</h1>
        <p>
          Understand the mobility concerns people have shared with Thaai Thadam.
        </p>
        <Link className="button button-primary" to="/report">
          Share a safety concern
        </Link>
      </div>
      <p className="field-help">
        These figures describe reports received through Thaai Thadam, not
        official safety statistics. Reports have not been verified. Exact
        landmarks and descriptions are not shared here.
      </p>

      {phase === "loading" && <><SkeletonList label="Loading community overview" /><SkeletonList label="Loading community reports" /></>}
      {phase === "error" && (
        <div className="page" role="alert">
          <h2>Community updates are unavailable</h2>
          <p>
            We could not load reports. Please check your connection and try
            again.
          </p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      )}
      {phase === "ready" && (
        <>
          <section aria-labelledby="community-overview-title">
            <div className="section-heading">
              <h2 id="community-overview-title">Community overview</h2>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setRefresh((value) => value + 1)}
              >
                Refresh updates
              </button>
            </div>
            <dl className="context-grid community-overview">
              <div className="context-card">
                <dt>Reports shared</dt>
                <dd>{summary.total_reports}</dd>
              </div>
              <div className="context-card">
                <dt>Most reported concern</dt>
                <dd>{mostReported}</dd>
              </div>
              <div className="context-card">
                <dt>Areas with reports</dt>
                <dd>{summary.by_area.length}</dd>
              </div>
            </dl>
          </section>

          {summary.total_reports === 0 ? (
            <section
              className="page community-empty"
              aria-labelledby="first-report-title"
            >
              <h2 id="first-report-title">Start the conversation</h2>
              <p>
                Community insights will appear as people share mobility
                concerns. There are no reports to show yet.
              </p>
              <Link className="button button-primary" to="/report">
                Share the first report
              </Link>
            </section>
          ) : (
            <>
              <section
                className="community-summaries"
                aria-labelledby="community-summary-title"
              >
                <h2 id="community-summary-title">What people are reporting</h2>
                <p className="field-help">
                  These summaries include all reports received. Filters below
                  apply only to the report list.
                </p>
                <div className="detail-columns">
                  <div className="page">
                    <h3>By concern</h3>
                    <ul className="community-counts">
                      {summary.by_category.map((item) => (
                        <li key={item.category}>
                          <span>{categoryLabels[item.category]}</span>
                          <strong>{item.count}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="page">
                    <h3>By area</h3>
                    <ul className="community-counts">
                      {summary.by_area.map((item) => (
                        <li key={item.area}>
                          <span>{item.area}</span>
                          <strong>{item.count}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section
                className="route-results"
                aria-labelledby="community-reports-title"
              >
                <h2 id="community-reports-title">Recent reports</h2>
                <p className="field-help">
                  Newest submissions first. Dates are shown in India time.
                </p>
                <form
                  className="planner-form"
                  aria-label="Filter community reports"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <div className="report-fields">
                    <div className="field">
                      <label htmlFor="community-category">Category</label>
                      <select
                        ref={categoryRef}
                        id="community-category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        aria-controls="community-report-list"
                      >
                        <option value="">All categories</option>
                        {reportCategories.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="community-area">Area</label>
                      <select
                        id="community-area"
                        value={area}
                        onChange={(event) => setArea(event.target.value)}
                        aria-controls="community-report-list"
                      >
                        <option value="">All areas</option>
                        {reportAreas.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                </form>
                <p
                  className="community-result-count"
                  role="status"
                  aria-atomic="true"
                >
                  Showing {visibleReports.length} of {summary.total_reports}{" "}
                  reports.
                </p>
                <div id="community-report-list">
                  {visibleReports.length ? (
                    <ul className="route-grid community-report-list">
                      {visibleReports.map((report) => (
                        <li
                          className="context-card community-report"
                          key={report.id}
                        >
                          <article
                            aria-labelledby={`community-report-${report.id}`}
                          >
                            <h3 id={`community-report-${report.id}`}>
                              {categoryLabels[report.category]}
                            </h3>
                            <p>{report.area}</p>
                            <p>
                              Received{" "}
                              <time dateTime={report.created_at}>
                                {dateFormatter.format(
                                  new Date(report.created_at),
                                )}
                              </time>
                            </p>
                            {report.occurred_at && (
                              <p>
                                Occurred{" "}
                                <time dateTime={report.occurred_at}>
                                  {dateFormatter.format(
                                    new Date(report.occurred_at),
                                  )}
                                </time>
                              </p>
                            )}
                            <p>Status: {report.status}</p>
                          </article>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="page community-filter-empty">
                      <h3>No reports match these filters</h3>
                      <p>
                        Try another category or area, or clear the filters to
                        see all reports.
                      </p>
                      <button
                        className="button button-secondary"
                        type="button"
                        onClick={clearFilters}
                      >
                        Show all reports
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
