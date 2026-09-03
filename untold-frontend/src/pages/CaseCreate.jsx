import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCase } from "../api/caseApi";

function CaseCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [premise, setPremise] = useState("");
  const [fullTruth, setFullTruth] = useState("");
  const [difficulty, setDifficulty] = useState("NORMAL");
  const [keywordsText, setKeywordsText] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    try {
      const newCase = await createCase({
        title,
        premise,
        fullTruth,
        difficulty,
        keywords,
      });
      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    marginTop: "6px",
    marginBottom: "20px",
  };

  return (
    <div>
      <h2>새 사건 등록</h2>
      <form onSubmit={handleSubmit}>
        <label>
          제목
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Premise (플레이어에게 보여줄 표면 스토리)
          <textarea
            style={{ ...inputStyle, minHeight: "120px" }}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            required
          />
        </label>

        <label>
          Full Truth (AI만 아는 전체 진실)
          <textarea
            style={{ ...inputStyle, minHeight: "160px" }}
            value={fullTruth}
            onChange={(e) => setFullTruth(e.target.value)}
            required
          />
        </label>

        <label>
          난이도
          <select
            style={inputStyle}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="EASY">EASY</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HARD">HARD</option>
          </select>
        </label>

        <label>
          키워드 (쉼표로 구분)
          <input
            style={inputStyle}
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
            placeholder="지하실, 가스, 도둑, 공범, 시체"
            required
          />
        </label>

        {error && <p style={{ color: "var(--amber)" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "등록하는 중..." : "사건 등록"}
        </button>
      </form>
    </div>
  );
}

export default CaseCreate;
