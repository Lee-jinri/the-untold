import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSessionProgress } from "../api/sessionApi";
import { askQuestion } from "../api/questionApi";

function GamePlay() {
  const { sessionId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPremise, setShowPremise] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchSessionProgress(sessionId)
      .then((data) => setProgress(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || asking) return;

    const question = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setAsking(true);

    try {
      const result = await askQuestion(sessionId, question);
      setMessages((prev) => [...prev, { role: "ai", text: result.answer }]);
      setProgress((prev) => ({
        ...prev,
        unlockedCount: result.unlockedCount,
        isSolved: result.isSolved,
      }));
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "에러: " + err.message },
      ]);
    } finally {
      setAsking(false);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          maxWidth: "280px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          padding: "12px 16px",
          fontSize: "0.75rem",
        }}
      >
        <div
          onClick={() => setShowPremise(!showPremise)}
          style={{
            cursor: "pointer",
            color: "var(--amber-light)",
            letterSpacing: "0.05em",
          }}
        >
          사건 개요 {showPremise ? "접기 ▲" : "펼치기 ▼"}
        </div>
        {showPremise && (
          <p
            style={{
              marginTop: "10px",
              whiteSpace: "pre-line",
              color: "var(--text-secondary)",
            }}
          >
            {progress.premise}
          </p>
        )}
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link
            to="/"
            style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
          >
            ← 사건 목록으로
          </Link>
        </div>

        <h2>{progress.caseTitle}</h2>
        <p style={{ marginTop: "16px" }}>
          키워드: {progress.unlockedCount}/{progress.totalKeywordCount}
        </p>
        {progress.isSolved && (
          <p style={{ color: "var(--amber-light)" }}>🎉 클리어!</p>
        )}

        <div
          style={{
            marginTop: "24px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-card)",
            minHeight: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {messages.length === 0 && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              질문을 통해 사건을 파헤쳐보세요.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                backgroundColor:
                  m.role === "user"
                    ? "var(--amber-dim)"
                    : "var(--bg-secondary)",
                color:
                  m.role === "user"
                    ? "var(--bg-primary)"
                    : "var(--text-primary)",
                padding: "8px 14px",
                fontSize: "0.85rem",
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAsk}
          style={{ display: "flex", gap: "8px", marginTop: "12px" }}
        >
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="질문을 입력하세요..."
            disabled={asking || progress.isSolved}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
            }}
          />
          <button type="submit" disabled={asking || progress.isSolved}>
            {asking ? "..." : "질문"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GamePlay;
