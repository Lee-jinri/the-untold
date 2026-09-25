import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAdminCaseById,
  updateCase,
  expandKeywords,
} from "../api/adminApi";

function AdminCaseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [keywordsText, setKeywordsText] = useState("");
  const [expandedTexts, setExpandedTexts] = useState([]);
  const [expanding, setExpanding] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }
    fetchAdminCaseById(id).then((data) => {
      setForm(data);
      setKeywordsText(data.keywords.join(", "));
      setExpandedTexts(data.expandedTexts || []);
    });
  }, [id]);

  const keywordsArray = keywordsText
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpand = async () => {
    if (keywordsArray.length === 0) return;
    setExpanding(true);
    setError(null);
    try {
      const result = await expandKeywords(keywordsArray);
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
      setError('키워드를 수정하셨다면 "키워드 확장" 버튼을 다시 눌러주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      await updateCase(id, { ...form, keywords, expandedTexts });
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

  if (!form) return <p>불러오는 중...</p>;

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      <h2>사건 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>
          제목
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>

        <label>
          Premise
          <textarea
            style={{ ...inputStyle, minHeight: "120px" }}
            value={form.premise}
            onChange={(e) => handleChange("premise", e.target.value)}
            required
          />
        </label>

        <label>
          Full Truth
          <textarea
            style={{ ...inputStyle, minHeight: "160px" }}
            value={form.fullTruth}
            onChange={(e) => handleChange("fullTruth", e.target.value)}
            required
          />
        </label>

        <label>
          힌트 1
          <textarea
            style={{ ...inputStyle, minHeight: "120px" }}
            value={form.hint1 || ""}
            onChange={(e) => handleChange("hint1", e.target.value)}
          />
        </label>

        <label>
          힌트 2
          <textarea
            style={{ ...inputStyle, minHeight: "120px" }}
            value={form.hint2 || ""}
            onChange={(e) => handleChange("hint2", e.target.value)}
          />
        </label>

        <label>
          판정 주의사항 (선택, AI가 헷갈릴 만한 포인트를 미리 알려주세요)
          <textarea
            style={{ ...inputStyle, minHeight: "100px" }}
            value={form.judgmentNotes || ""}
            onChange={(e) => handleChange("judgmentNotes", e.target.value)}
            placeholder="예: '형제가 있냐'는 질문만으로는 '쌍둥이' 키워드를 인정하지 마세요."
          />
        </label>

        <label>
          난이도
          <select
            style={inputStyle}
            value={form.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
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
          {submitting ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}

export default AdminCaseEdit;
