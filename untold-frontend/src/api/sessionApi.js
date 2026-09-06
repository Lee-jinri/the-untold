const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchSessionProgress(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions/${sessionId}/progress`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
}

export async function revealHint(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions/${sessionId}/hints`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
}
