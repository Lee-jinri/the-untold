import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminCases, deleteCase } from "../api/adminApi";

function AdminCaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      navigate("/admin");
      return;
    }
    fetchAdminCases()
      .then(setCases)
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    await deleteCase(id);
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2>사건 관리</h2>
        <Link to="/admin/cases/new">
          <button>+ 새 사건</button>
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {cases.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>{c.title}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                난이도: {c.difficulty} · 키워드 {c.keywords.length}개
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to={`/admin/cases/${c.id}/edit`}>
                <button style={{ fontSize: "0.8rem", padding: "6px 14px" }}>
                  수정
                </button>
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                style={{
                  fontSize: "0.8rem",
                  padding: "6px 14px",
                  borderColor: "#993C1D",
                  color: "#993C1D",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCaseList;
