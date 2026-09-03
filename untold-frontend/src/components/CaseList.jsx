import { Link } from "react-router-dom";
import { useEffect, useState, userEffect } from "react";
import { fetchCases } from "../api/caseApi";

function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCases()
      .then((data) => setCases(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>사건 목록을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (cases.length === 0) return <p>등록된 사건이 없어요.</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>미해결 사건 목록</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {cases.map((c) => (
          <Link
            key={c.id}
            to={`/cases/${c.id}`}
            style={{
              display: "block",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              padding: "20px 24px",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--amber-dim)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-color)")
            }
          >
            <h3>{c.title}</h3>
            <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
              난이도: {c.difficulty}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CaseList;
