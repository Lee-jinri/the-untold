const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function adminLogin(password) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }
  return response.json();
}

export async function fetchAdminCases() {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("사건 목록을 불러오지 못했어요");
  return response.json();
}

export async function fetchAdminCaseById(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("사건을 불러오지 못했어요");
  return response.json();
}

export async function updateCase(id, caseData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(caseData),
  });
  if (!response.ok) throw new Error("사건 수정에 실패했어요");
  return response.json();
}

export async function deleteCase(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("사건 삭제에 실패했어요");
}

export async function createCaseAdmin(caseData) {
  const response = await fetch(`${API_BASE_URL}/api/cases`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(caseData),
  });
  if (!response.ok) throw new Error("사건 등록에 실패했어요");
  return response.json();
}
