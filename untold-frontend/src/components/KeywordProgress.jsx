import { useState, useEffect, useRef } from "react";

function KeywordProgress({ unlockedKeywords, totalCount }) {
  const [displayedKeywords, setDisplayedKeywords] = useState(unlockedKeywords);
  const [flippingIndex, setFlippingIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const prevCountRef = useRef(unlockedKeywords.length);

  useEffect(() => {
    if (unlockedKeywords.length > prevCountRef.current) {
      const newIndex = prevCountRef.current;
      const newKeyword = unlockedKeywords[newIndex];

      setFlippingIndex(newIndex);
      setToast(newKeyword);

      const flipTimer = setTimeout(() => {
        setDisplayedKeywords(unlockedKeywords);
      }, 300);

      const flipEndTimer = setTimeout(() => {
        setFlippingIndex(null);
      }, 700);

      const toastTimer = setTimeout(() => {
        setToast(null);
      }, 1800);

      prevCountRef.current = unlockedKeywords.length;

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(flipEndTimer);
        clearTimeout(toastTimer);
      };
    } else {
      setDisplayedKeywords(unlockedKeywords);
      prevCountRef.current = unlockedKeywords.length;
    }
  }, [unlockedKeywords]);

  return (
    <div style={{ marginTop: "20px", position: "relative" }}>
      <style>{`
        @keyframes cardFlip {
          0%   { transform: rotateY(0deg) scale(1); }
          45%  { transform: rotateY(90deg) scale(1.08); }
          55%  { transform: rotateY(90deg) scale(1.08); }
          70%  { transform: rotateY(180deg) scale(1.12); }
          100% { transform: rotateY(180deg) scale(1); }
        }
        @keyframes glowPulse {
          0%   { box-shadow: 0 0 0px rgba(245, 166, 35, 0); }
          40%  { box-shadow: 0 0 24px rgba(245, 166, 35, 0.9); }
          100% { box-shadow: 0 0 6px rgba(245, 166, 35, 0.3); }
        }
        @keyframes toastPop {
          0%   { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
          15%  { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
          25%  { transform: translate(-50%, 0) scale(1); }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -10px) scale(0.95); }
        }
        .keyword-flip {
          animation: cardFlip 0.7s ease-in-out, glowPulse 0.9s ease-out;
        }
      `}</style>

      {toast && (
        <div
          style={{
            position: "absolute",
            top: "-44px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--amber)",
            color: "var(--bg-primary)",
            padding: "6px 16px",
            fontSize: "0.8rem",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            animation: "toastPop 1.8s ease-out forwards",
          }}
        >
          🔓 키워드 해금: {toast}
        </div>
      )}

      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
        키워드 {unlockedKeywords.length}/{totalCount}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: totalCount }).map((_, i) => {
          const keyword = displayedKeywords[i];
          const isFlipping = flippingIndex === i;

          return (
            <div
              key={i}
              className={isFlipping ? "keyword-flip" : ""}
              style={{
                width: "84px",
                height: "50px",
                border: `1px solid ${
                  keyword ? "var(--amber)" : "var(--border-color)"
                }`,
                backgroundColor: "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: keyword ? "0.85rem" : "1.2rem",
                color: keyword ? "var(--amber-light)" : "var(--text-muted)",
                transformStyle: "preserve-3d",
              }}
            >
              {keyword ? keyword : "🔒"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KeywordProgress;
