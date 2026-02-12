import React, { useState } from "react";
import Layout from "../layout/Layout";
import Registration from "../students/Registration";
import Circular from "../circular/Circular";
import Timetable from "../timetable/Timetable";
import Result from "../UnivercityResult/UnivercityResult"; 
import Faculty from "../faculty/faculty";
import InternalMarks from "../Internalmarks result/Internal";
import PracticalMarks from "../practicalmarkResult/Practical";
import Finalresult from "../Final result/Finalresult";
import CourseSemesterPage from "../CourseSemPage.js/CourseSemesterPage"; 
import Totalmarks from "../SemesterWiseTotalMarks/SemesterWiseTotalMarks";
import FinalCertificate from "../Finalcertificate/Finalcertificate";


export default function Main() {
  const [active, setActive] = useState("students");

  return (
    <Layout active={active} setActive={setActive}>
      {active === "students" && <Registration />}
      {active === "circular" && <Circular />}
      {active === "timetable" && <Timetable />}
      {active === "Result" && <Result />}
      {active === "faculty" && <Faculty />}
      {active === "internal" && <InternalMarks />}
      {active === "practical" && <PracticalMarks />}
      {active === "final" && <Finalresult />}
      {active === "course" && <CourseSemesterPage />}
      {active === "marks" && <Totalmarks />}
      {active === "finalcertificate" && <FinalCertificate />}
    </Layout>
  );
}
