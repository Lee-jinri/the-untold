import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchCaseById, startGameSession } from "../api/caseApi";

function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchCaseById(id)
      .then((data) => setCaseData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const session = await startGameSession(id);
      navigate(`/sessions/${session.id}`);
    } catch (err) {
      setError(err.message);
      setStarting(false);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div
      style={{ maxWidth: "560px", margin: "60px auto", textAlign: "center" }}
    >
      <div style={{ textAlign: "left", marginBottom: "40px" }}>
        <Link
          to="/"
          style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
        >
          ← 사건 목록으로
        </Link>
      </div>
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
        }}
      >
        사건 파일
      </p>
      <h2 style={{ marginTop: "8px" }}>{caseData.title}</h2>
      <p style={{ marginTop: "8px", fontSize: "0.85rem" }}>
        난이도: {caseData.difficulty} · 키워드 {caseData.keywordCount}개
      </p>
      <p
        style={{ marginTop: "32px", whiteSpace: "pre-line", textAlign: "left" }}
      >
        {caseData.premise}
      </p>
      <div style={{ marginTop: "36px" }}>
        <button onClick={handleStart} disabled={starting}>
          {starting ? "시작하는 중..." : "수사 시작"}
        </button>
      </div>
    </div>
  );
}

export default CaseDetail;
