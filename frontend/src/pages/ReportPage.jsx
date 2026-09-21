import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import SkeletonList from "../components/Skeleton";
import { reportAreas, reportCategories } from "../data/reportOptions";
import { submitReport } from "../services/reports";

const emptyForm = {
  category: "",
  area: "",
  landmark: "",
  description: "",
  occurred_at: "",
};

export default function ReportPage() {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const failureRef = useRef(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    document.title = "Report an issue | Thaai Thadam";
  }, []);
  useEffect(() => {
    if (receipt) successRef.current?.focus();
  }, [receipt]);
  useEffect(() => {
    if (failure) failureRef.current?.focus();
  }, [failure]);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sendingRef.current) return;
    const nextErrors = {};
    if (!values.category) nextErrors.category = "Choose a category.";
    if (!values.area) nextErrors.area = "Choose an area.";
    if (values.landmark.trim().length > 160)
      nextErrors.landmark = "Use 160 characters or fewer.";
    const description = values.description.trim();
    if (description.length < 10 || description.length > 2000)
      nextErrors.description =
        "Describe the concern in 10 to 2,000 characters.";
    const occurred = values.occurred_at ? new Date(values.occurred_at) : null;
    if (
      occurred &&
      (!Number.isFinite(occurred.getTime()) || occurred > new Date())
    )
      nextErrors.occurred_at = "Choose a valid time that is not in the future.";
    setErrors(nextErrors);
    setFailure("");
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current?.elements.namedItem(Object.keys(nextErrors)[0]).focus(),
      );
      return;
    }
    sendingRef.current = true;
    setSending(true);
    try {
      const result = await submitReport({
        category: values.category,
        area: values.area,
        landmark: values.landmark.trim() || null,
        description,
        occurred_at: occurred ? occurred.toISOString() : null,
      });
      setReceipt(result);
    } catch (error) {
      setFailure(error.message);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  function startAnother() {
    setValues(emptyForm);
    setErrors({});
    setFailure("");
    setReceipt(null);
    requestAnimationFrame(() =>
      formRef.current?.elements.namedItem("category").focus(),
    );
  }

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">YOUR EXPERIENCE MATTERS</p>
        <h1>Report a safety concern</h1>
        <p>Tell us about a mobility or public space safety concern.</p>
      </div>
      <aside className="demo-notice" aria-label="Emergency help information">
        <div>
          <p>
            Reporting helps build a clearer picture of mobility safety. If you
            are in immediate danger, use{" "}
            <Link className="hub-reference-link" to="/emergency">
              Emergency Help
            </Link>{" "}
            instead.
          </p>
          <p>
            This form does not contact emergency services. Emergency Help
            provides call links and tools to share your location.
          </p>
        </div>
      </aside>
      {receipt ? (
        <section className="page" aria-labelledby="report-success">
          <h2 id="report-success" ref={successRef} tabIndex={-1}>
            Report received
          </h2>
          <p>
            Thaai Thadam has received your report. This confirms receipt only,
            not verification or resolution.
          </p>
          <dl className="hub-facts">
            <div>
              <dt>Report reference</dt>
              <dd>#{receipt.id}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{receipt.status}</dd>
            </div>
            <div>
              <dt>Received at</dt>
              <dd>
                <time dateTime={receipt.created_at}>
                  {new Date(receipt.created_at).toLocaleString()}
                </time>
              </dd>
            </div>
          </dl>
          <div className="hub-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={startAnother}
            >
              Submit another report
            </button>
            <Link className="button button-secondary" to="/community">
              View community updates
            </Link>
          </div>
        </section>
      ) : (
        <form
          ref={formRef}
          className="planner-form report-form"
          noValidate
          onSubmit={handleSubmit}
          aria-busy={sending}
        >
          <p>
            No account or contact details are needed. The community sees only
            the category, area, dates and received status. Landmarks and
            descriptions are not shared. Please leave out names, phone numbers
            and other identifying information.
          </p>
          <p className="field-help">
            Category, area and description are required.
          </p>
          <fieldset disabled={sending}>
            <legend>Tell us about the concern</legend>
            <div className="report-fields">
              <div className="field">
                <label htmlFor="report-category">Category</label>
                <select
                  id="report-category"
                  name="category"
                  required
                  value={values.category}
                  onChange={update}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "category-error" : undefined
                  }
                >
                  <option value="">Choose a category</option>
                  {reportCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="form-error" id="category-error">
                    {errors.category}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="report-area">Area</label>
                <select
                  id="report-area"
                  name="area"
                  required
                  value={values.area}
                  onChange={update}
                  aria-invalid={Boolean(errors.area)}
                  aria-describedby={errors.area ? "area-error" : undefined}
                >
                  <option value="">Choose an area</option>
                  {reportAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <p className="form-error" id="area-error">
                    {errors.area}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="report-landmark">
                  Nearby landmark (optional)
                </label>
                <input
                  id="report-landmark"
                  name="landmark"
                  maxLength={160}
                  value={values.landmark}
                  onChange={update}
                  aria-invalid={Boolean(errors.landmark)}
                  aria-describedby={
                    errors.landmark ? "landmark-error" : undefined
                  }
                />
                {errors.landmark && (
                  <p className="form-error" id="landmark-error">
                    {errors.landmark}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="report-time">When it happened (optional)</label>
                <input
                  id="report-time"
                  name="occurred_at"
                  type="datetime-local"
                  value={values.occurred_at}
                  onChange={update}
                  aria-invalid={Boolean(errors.occurred_at)}
                  aria-describedby={`time-help${errors.occurred_at ? " time-error" : ""}`}
                />
                <p className="field-help" id="time-help">
                  Use the time shown in your device's time zone.
                </p>
                {errors.occurred_at && (
                  <p className="form-error" id="time-error">
                    {errors.occurred_at}
                  </p>
                )}
              </div>
            </div>
            <div className="field">
              <label htmlFor="report-description">Description</label>
              <textarea
                id="report-description"
                name="description"
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                value={values.description}
                onChange={update}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={`description-help${errors.description ? " description-error" : ""}`}
              />
              <p className="field-help" id="description-help">
                Describe what happened and how it affected your journey.{" "}
                {values.description.length}/2,000 characters.
              </p>
              {errors.description && (
                <p className="form-error" id="description-error">
                  {errors.description}
                </p>
              )}
            </div>
          </fieldset>
          {sending && <SkeletonList label="Waiting for report confirmation" count={1} />}
          {failure && (
            <p
              className="form-error"
              id="report-failure"
              role="alert"
              ref={failureRef}
              tabIndex={-1}
            >
              {failure}
            </p>
          )}
          <button
            className="button button-primary"
            type="submit"
            disabled={sending}
          >
            {sending ? "Sending report..." : "Submit report"}
          </button>
          <p className="sr-only" role="status">
            {sending ? "Sending your report. Please wait." : ""}
          </p>
        </form>
      )}
    </>
  );
}
