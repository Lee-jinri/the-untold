const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function askQuestion(sessionId, questionText) {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions/${sessionId}/questions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionText }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
}
