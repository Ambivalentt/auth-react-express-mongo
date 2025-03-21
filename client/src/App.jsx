import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./register.jsx";
import LoginForm from "./loginUser.jsx";
import Index from './index.jsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}
