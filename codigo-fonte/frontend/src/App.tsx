import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewPassword from "./pages/NewPassword";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/esqueci-minha-senha" element={<NewPassword />} /> 
      <Route path="/nova-senha" element={<ForgotPassword />} /> 
    </Routes>
  );
}
