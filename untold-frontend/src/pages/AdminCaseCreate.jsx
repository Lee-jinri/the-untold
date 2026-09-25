import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCaseAdmin, expandKeywords } from "../api/adminApi";

function CaseCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [premise, setPremise] = useState("");
  const [fullTruth, setFullTruth] = useState("");
  const [hint1, setHint1] = useState("");
  const [hint2, setHint2] = useState("");
  const [difficulty, setDifficulty] = useState("NORMAL");
  const [keywordsText, setKeywordsText] = useState("");
  const [expandedTexts, setExpandedTexts] = useState([]);
  const [expanding, setExpanding] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [judgmentNotes, setJudgmentNotes] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }
  }, []);

  const keywordsArray = keywordsText
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  const handleExpand = async () => {
    if (keywordsArray.length === 0) return;
    setExpanding(true);
    setError(null);
    try {
      const result = await expandKeywords(keywordsArray);
      // result는 { "지하실": "지하실, 밀폐된...", "가스": "..." } 형태
      const ordered = keywordsArray.map((kw) => result[kw] || kw);
      setExpandedTexts(ordered);
    } catch (err) {
      setError(err.message);
    } finally {
      setExpanding(false);
    }
  };

  const handleExpandedTextChange = (index, value) => {
    setExpandedTexts((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (expandedTexts.length !== keywordsArray.length) {
      setError('먼저 "키워드 확장" 버튼을 눌러주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    try {
      const newCase = await createCaseAdmin({
        title,
        premise,
        fullTruth,
        hint1,
        hint2,
        difficulty,
        keywords: keywordsArray,
        expandedTexts,
        judgmentNotes,
      });
      navigate("/admin/cases");
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
          힌트 1 (10번째 질문 후 또는 버튼 클릭시 공개)
          <textarea
            style={{ ...inputStyle, minHeight: "120px" }}
            value={hint1}
            onChange={(e) => setHint1(e.target.value)}
          />
        </label>

        <label>
          힌트 2 (20번째 질문 후 또는 버튼 클릭시 공개)
          <textarea
            style={{ ...inputStyle, minHeight: "120px" }}
            value={hint2}
            onChange={(e) => setHint2(e.target.value)}
          />
        </label>

        <label>
          판정 주의사항 (AI가 헷갈릴 만한 포인트를 미리 알려주세요)
          <textarea
            style={{ ...inputStyle, minHeight: "100px" }}
            value={judgmentNotes}
            onChange={(e) => setJudgmentNotes(e.target.value)}
            placeholder="예: '형제가 있냐'는 질문만으로는 '쌍둥이' 키워드를 인정하지 마세요."
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
            onChange={(e) => {
              setKeywordsText(e.target.value);
              setExpandedTexts([]); // 키워드 바뀌면 확장 결과 초기화
            }}
            placeholder="지하실, 가스, 도둑"
            required
          />
        </label>

        <button
          type="button"
          onClick={handleExpand}
          disabled={expanding || keywordsArray.length === 0}
        >
          {expanding ? "확장 중..." : "키워드 확장"}
        </button>

        {expandedTexts.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              확장된 키워드 (필요시 수정)
            </p>
            {keywordsArray.map((kw, i) => (
              <div key={i} style={{ marginTop: "10px" }}>
                <label
                  style={{ fontSize: "0.8rem", color: "var(--amber-light)" }}
                >
                  {kw}
                </label>
                <textarea
                  style={{ ...inputStyle, minHeight: "60px", marginTop: "4px" }}
                  value={expandedTexts[i] || ""}
                  onChange={(e) => handleExpandedTextChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: "var(--amber)" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "등록하는 중..." : "사건 등록"}
        </button>
      </form>
    </div>
  );
}

export default CaseCreate;
