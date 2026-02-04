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

function App() {
  // 🔐 Login check
  const isLogin = localStorage.getItem("facultyData");

  return (
    <Router>
      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/" element={<FacultyLogin />} />
        <Route path="/login" element={<FacultyLogin />} />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/faculty-dashboard"
          element={
            isLogin ? <FacultyDashboard /> : <Navigate to="/login" replace />
          }
        />

        {/* ================= INTERNAL RESULT ================= */}
        <Route
          path="/internal-result"
          element={
            isLogin ? <InternalResult /> : <Navigate to="/login" replace />
          }
        />

        {/* ================= PRACTICAL RESULT ================= */}
        <Route
          path="/practical-result"
          element={
            isLogin ? <PracticalResult /> : <Navigate to="/login" replace />
          }
        />

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
