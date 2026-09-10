import { useState, useEffect, useRef } from "react";

function KeywordProgress({ unlockedKeywords, totalCount }) {
  const [displayedKeywords, setDisplayedKeywords] = useState(unlockedKeywords);
  const [flippingIndex, setFlippingIndex] = useState(null);
  const [centerAlert, setCenterAlert] = useState(null);
  const prevCountRef = useRef(unlockedKeywords.length);

  useEffect(() => {
    if (unlockedKeywords.length > prevCountRef.current) {
      const newIndex = prevCountRef.current;
      const newKeyword = unlockedKeywords[newIndex];

      setFlippingIndex(newIndex);
      setCenterAlert(newKeyword);

      const flipTimer = setTimeout(() => {
        setDisplayedKeywords(unlockedKeywords);
      }, 300);

      const flipEndTimer = setTimeout(() => {
        setFlippingIndex(null);
      }, 700);

      const centerAlertTimer = setTimeout(() => {
        setCenterAlert(null);
      }, 2000);

      prevCountRef.current = unlockedKeywords.length;

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(flipEndTimer);
        clearTimeout(centerAlertTimer);
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
        @keyframes centerAlertPop {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          15%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          25%  { transform: translate(-50%, -50%) scale(1); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        }
        @keyframes shine {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        .keyword-flip {
          animation: cardFlip 0.7s ease-in-out, glowPulse 0.9s ease-out;
        }
      `}</style>

      {centerAlert && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#b8791a",
            backgroundImage:
              "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            color: "var(--bg-primary)",
            padding: "20px 40px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            zIndex: 1000,
            boxShadow: "0 0 30px rgba(245, 166, 35, 0.6)",
            borderRadius: "12px",
            animation:
              "centerAlertPop 2s ease-out forwards, shine 1.2s ease-in-out",
          }}
        >
          🔓 키워드 해금: {centerAlert}
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
