const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function requestReports(options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/reports`, {
        ...options,
        signal: controller.signal,
      });
    } catch {
      throw new Error(
        "We could not confirm receipt. Your text is still here. Please check your connection and try again. If the connection failed after sending, retrying may create another report.",
      );
    }
    if (!response.ok) {
      throw new Error(
        response.status === 422
          ? "Some details need checking. Review the category, area, description and time, then try again."
          : "We could not complete the request. Your text is still here. Please try again later.",
      );
    }
    try {
      return await response.json();
    } catch {
      throw new Error(
        "We could not read the confirmation. Your report may have been received. Your text is still here.",
      );
    }
  } finally {
    clearTimeout(timer);
  }
}

export function submitReport(report) {
  return requestReports({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
}

export function getReports() {
  return requestReports();
}
