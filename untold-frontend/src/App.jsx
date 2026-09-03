import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CaseList from "./components/CaseList";
import CaseDetail from "./pages/CaseDetail";
import CaseCreate from "./pages/CaseCreate";
import GamePlay from "./pages/GamePlay";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  return (
    <div>
      <h1>Untold</h1>
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/cases/new"
          style={{ color: "var(--amber-light)", fontSize: "0.85rem" }}
        >
          + 새 사건 등록
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<CaseList />} />
        <Route path="/cases/new" element={<CaseCreate />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/sessions/:sessionId" element={<GamePlay />} />
      </Routes>
    </div>
  );
}

export default App;
