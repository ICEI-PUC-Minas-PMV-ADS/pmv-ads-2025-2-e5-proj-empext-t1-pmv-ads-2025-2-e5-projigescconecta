import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/Forgotmypassword"; // se o arquivo chama Forgotmypassword.tsx
import NewPassword from "./pages/NewPassword";

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/new-password" element={<NewPassword />} />

      {/* Fallback: qualquer rota desconhecida vai para /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
