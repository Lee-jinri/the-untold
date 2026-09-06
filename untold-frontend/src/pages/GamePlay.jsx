import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSessionProgress } from "../api/sessionApi";
import { askQuestion } from "../api/questionApi";
import KeywordProgress from "../components/KeywordProgress";
import { revealHint } from "../api/sessionApi";

function GamePlay() {
  const { sessionId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPremise, setShowPremise] = useState(false);
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [asking, setAsking] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevHintsRevealedRef = useRef(0);

  useEffect(() => {
    fetchSessionProgress(sessionId)
      .then((data) => setProgress(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    if (progress && !progress.solved) {
      inputRef.current?.focus();
    }
  }, [progress]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      const updatedProgress = await fetchSessionProgress(sessionId);
      setProgress(updatedProgress);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "에러: " + err.message },
      ]);
    } finally {
      setAsking(false);
    }
  };

  useEffect(() => {
    if (!progress) return;

    if (progress.hintsRevealed > prevHintsRevealedRef.current) {
      if (progress.hintsRevealed === 1) {
        setShowHint1(true);
      } else if (progress.hintsRevealed === 2) {
        setShowHint2(true);
      }
    }

    prevHintsRevealedRef.current = progress.hintsRevealed;
  }, [progress?.hintsRevealed]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  // 클리어 화면
  if (progress.solved) {
    return (
      <div
        style={{ maxWidth: "480px", margin: "80px auto", textAlign: "center" }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: "var(--amber-light)",
          }}
        >
          사건 종결
        </p>
        <h2 style={{ marginTop: "12px" }}>{progress.caseTitle}</h2>
        <p style={{ marginTop: "24px", color: "var(--text-secondary)" }}>
          모든 키워드를 찾아냈습니다.
        </p>
        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            총 질문 수
          </p>
          <p
            style={{
              fontSize: "2rem",
              color: "var(--amber-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {progress.unlockedKeywords.length >= 0
              ? messages.filter((m) => m.role === "user").length
              : "-"}
          </p>
        </div>
        <div
          style={{
            marginTop: "32px",
            whiteSpace: "pre-line",
            textAlign: "left",
            fontSize: "0.85rem",
          }}
        >
          {progress.fullTruth}
        </div>
        <div style={{ marginTop: "32px" }}>
          <Link to="/">
            <button>다른 사건 풀러 가기</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRevealHint = async () => {
    try {
      await revealHint(sessionId);
      const updatedProgress = await fetchSessionProgress(sessionId);
      setProgress(updatedProgress);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
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
        <KeywordProgress
          unlockedKeywords={progress.unlockedKeywords}
          totalCount={progress.totalKeywordCount}
        />
        {progress.solved && (
          <p style={{ color: "var(--amber-light)" }}>🎉 클리어!</p>
        )}

        <div
          style={{
            marginTop: "20px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-card)",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            힌트 {progress.hintsRevealed}/2 · 질문 {progress.questionCount}개
          </span>
          {progress.hintsRevealed < 2 && (
            <button
              onClick={handleRevealHint}
              style={{ fontSize: "0.75rem", padding: "4px 12px" }}
            >
              힌트 보기
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: "20px",
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
            사건 개요 {showPremise ? "▲" : "▼"}
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

        {progress.hint1 && (
          <div
            style={{
              marginTop: "12px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              padding: "16px",
            }}
          >
            <div
              onClick={() => setShowHint1(!showHint1)}
              style={{
                cursor: "pointer",
                color: "var(--amber-light)",
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
              }}
            >
              힌트 1 {showHint1 ? "▲" : "▼"}
            </div>
            {showHint1 && (
              <p
                style={{
                  marginTop: "10px",
                  whiteSpace: "pre-line",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                {progress.hint1}
              </p>
            )}
          </div>
        )}

        {progress.hint2 && (
          <div
            style={{
              marginTop: "12px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              padding: "16px",
            }}
          >
            <div
              onClick={() => setShowHint2(!showHint2)}
              style={{
                cursor: "pointer",
                color: "var(--amber-light)",
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
              }}
            >
              힌트 2 {showHint2 ? "▲" : "▼"}
            </div>
            {showHint2 && (
              <p
                style={{
                  marginTop: "10px",
                  whiteSpace: "pre-line",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                {progress.hint2}
              </p>
            )}
          </div>
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
                  m.role === "user" ? "#af7210" : "var(--bg-secondary)",
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
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleAsk}
          style={{ display: "flex", gap: "8px", marginTop: "12px" }}
        >
          <input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="질문을 입력하세요..."
            disabled={asking || progress.solved}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "16px",
            }}
          />
          <button type="submit" disabled={asking || progress.solved}>
            {asking ? "..." : "질문"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GamePlay;
