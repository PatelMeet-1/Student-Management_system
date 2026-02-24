import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FacultyLogin from "./component/loginpage";
import FacultyDashboard from "./component/FacultyDashboard";
import InternalResult from "./component/InternalResult";
import PracticalResult from "./component/PracticalResult";
import Layout from "./component/Layout";
import { useEffect, useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Dynamic check karo localStorage
  useEffect(() => {
    const checkAuth = () => {
      const facultyData = localStorage.getItem("facultyData");
      setIsLogin(!!facultyData); // Boolean convert
      setLoading(false);
    };

    checkAuth(); // Initial check
    
    // Sidebar ke auto-logout ke saath sync rahe
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('beforeunload', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleStorageChange);
    };
  }, []);

  // Loading state
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div>Loading...</div>
    </div>;
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/" element={<FacultyLogin />} />
        <Route path="/login" element={<FacultyLogin />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            isLogin ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/internal-result" element={<InternalResult />} />
          <Route path="/practical-result" element={<PracticalResult />} />
        </Route>

        {/* CATCH ALL */}
        <Route
          path="*"
          element={
            <Navigate 
              to={isLogin ? "/faculty-dashboard" : "/login"} 
              replace 
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
