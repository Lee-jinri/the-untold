import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CaseList from "./components/CaseList";
import CaseDetail from "./pages/CaseDetail";
import GamePlay from "./pages/GamePlay";
import AdminLogin from "./pages/AdminLogin";
import AdminCaseCreate from "./pages/AdminCaseCreate";
import AdminCaseList from "./pages/AdminCaseList";
import AdminCaseEdit from "./pages/AdminCaseEdit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  return (
    <div>
      <h1>Untold</h1>
      <Routes>
        <Route path="/" element={<CaseList />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/sessions/:sessionId" element={<GamePlay />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/cases" element={<AdminCaseList />} />
        <Route path="/admin/cases/:id/edit" element={<AdminCaseEdit />} />
        <Route path="/admin/cases/new" element={<AdminCaseCreate />} />
      </Routes>
    </div>
  );
}

export default App;
