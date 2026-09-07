import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdminCaseById, updateCase } from "../api/adminApi";

function AdminCaseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [keywordsText, setKeywordsText] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      navigate("/admin");
      return;
    }
    fetchAdminCaseById(id).then((data) => {
      setForm(data);
      setKeywordsText(data.keywords.join(", "));
    });
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      await updateCase(id, { ...form, keywords });
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
            onChange={(e) => setKeywordsText(e.target.value)}
            required
          />
        </label>

        {error && <p style={{ color: "var(--amber)" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}

export default AdminCaseEdit;
