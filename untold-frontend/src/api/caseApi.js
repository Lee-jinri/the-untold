const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCases() {
  const response = await fetch(`${API_BASE_URL}/api/cases`);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }
  return response.json();
}

export async function fetchCaseById(id) {
  const response = await fetch(`${API_BASE_URL}/api/cases/${id}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
}

export async function startGameSession(caseId) {
  const response = await fetch(`${API_BASE_URL}/api/cases/${caseId}/sessions`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
}

export async function createCase(caseData) {
  const response = await fetch(`${API_BASE_URL}/api/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(caseData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
}
