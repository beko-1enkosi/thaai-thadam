import Icon from "./Icon";
import { useState } from "react";

const STORAGE_KEY = "thaai-thadam:prototype-notice-dismissed";

export default function PrototypeNotice() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Dismissal still works when the browser blocks storage.
    }
    document.getElementById("main-content")?.focus();
  }

  if (dismissed) return null;
  return (
    <aside
      className="prototype-notice"
      aria-labelledby="prototype-notice-title"
    >
      <div>
        <strong id="prototype-notice-title">Prototype environment</strong>
        <p>
          Some route, safety and mobility information shown here is simulated
          for demonstration purposes.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss prototype notice"
      >
        <Icon name="close" size={18} />
      </button>
    </aside>
  );
}
