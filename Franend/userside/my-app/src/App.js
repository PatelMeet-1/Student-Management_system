import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLoginResult from "./component/StudentLoginResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLoginResult />} />
        <Route path="login" element={<StudentLoginResult />} />
        <Route path="*" element={<StudentLoginResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
