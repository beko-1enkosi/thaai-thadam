const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
export const assistantUnavailable = 'Thaai is taking a short break right now. You can still use Journey, Safe Hubs, Report, Community and Emergency Help.';

export async function askThaai(message, history, currentPath, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: history.slice(-10), current_path: currentPath }),
      signal,
    });
  } catch {
    throw new Error(assistantUnavailable);
  }
  if (!response.ok) {
    throw new Error(response.status === 429
      ? 'Thaai is busy right now. Please try again shortly. Emergency Help remains available.'
      : response.status === 422 ? 'Please keep your message within 2,000 characters and try again.' : assistantUnavailable);
  }
  try {
    const result = await response.json();
    if (typeof result.message !== 'string' || !result.message.trim() || result.message.length > 2000) throw new Error();
    return result.message;
  } catch { throw new Error(assistantUnavailable); }
}
