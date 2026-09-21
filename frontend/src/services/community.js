const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function getCommunityReports(signal) {
  const response = await fetch(`${API_BASE_URL}/api/community/reports`, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Community updates could not be loaded.");
  }
  return response.json();
}
