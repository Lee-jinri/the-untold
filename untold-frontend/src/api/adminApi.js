const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchAdminCases() {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases`);
  if (!response.ok) throw new Error("사건 목록을 불러오지 못했어요");
  return response.json();
}

export async function fetchAdminCaseById(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases/${id}`);
  if (!response.ok) throw new Error("사건을 불러오지 못했어요");
  return response.json();
}

export async function updateCase(id, caseData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(caseData),
  });
  if (!response.ok) throw new Error("사건 수정에 실패했어요");
  return response.json();
}

export async function deleteCase(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/cases/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("사건 삭제에 실패했어요");
}
