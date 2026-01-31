import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchPage from "./pages/MatchPage";
import SessionReview from "./pages/SessionReview";
import "./index.css";

const STORAGE_KEY = "bettermatch_session";

const HomeRedirect: React.FC = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const session = JSON.parse(saved);
      if (session.matches && session.matches.length > 0) {
        return <Navigate to="/matches" replace />;
      }
    } catch {
      // Invalid data, show homepage
    }
  }
  return <HomePage />;
};

const root = document.getElementById("root");

if (!root) {
  throw new Error('Failed to find root element with id "root"');
}

// TEMPORARY DEBUG CHECK
createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/match" element={<MatchPage />} />
      <Route path="/review" element={<SessionReview />} />
      <Route path="/" element={<HomePage />} /> {/* Bypass the redirect for a moment */}
      <Route path="/match" element={<MatchPage />} />
    </Routes>
  </BrowserRouter>
);
