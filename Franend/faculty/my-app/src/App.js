import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import FacultyLogin from "./component/loginpage";
import FacultyDashboard from "./component/FacultyDashboard";
import InternalResult from "./component/InternalResult";
import PracticalResult from "./component/PracticalResult";
import Layout from "./component/Layout";

function App() {
  // 🔐 Login check
  const isLogin = localStorage.getItem("facultyData");

  return (
    <Router>
      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/" element={<FacultyLogin />} />
        <Route path="/login" element={<FacultyLogin />} />

        {/* Protected routes wrapped by Layout (renders Sidebar) */}
        <Route
          element={isLogin ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/internal-result" element={<InternalResult />} />
          <Route path="/practical-result" element={<PracticalResult />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={<Navigate to={isLogin ? "/faculty-dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
