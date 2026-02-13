import React, { useState } from "react";
import Layout from "../layout/Layout";
import CourseSemesterPage from "../CourseSemPage.js/CourseSemesterPage"; 
import Registration from "../students/Registration";
import Circular from "../circular/Circular";
import Timetable from "../timetable/Timetable";
import Result from "../UnivercityResult/UnivercityResult"; 
import Faculty from "../faculty/faculty";
import InternalMarks from "../Internalmarks result/Internal";
import PracticalMarks from "../practicalmarkResult/Practical";
import Finalresult from "../Final result/Finalresult";
import Totalmarks from "../SemesterWiseTotalMarks/SemesterWiseTotalMarks";


export default function Main() {
  const [active, setActive] = useState("students");

  return (
    <Layout active={active} setActive={setActive}>
      {active === "course" && <CourseSemesterPage />}
      {active === "students" && <Registration />}
      {active === "circular" && <Circular />}
      {active === "timetable" && <Timetable />}
      {active === "Result" && <Result />}
      {active === "faculty" && <Faculty />}
      {active === "internal" && <InternalMarks />}
      {active === "practical" && <PracticalMarks />}
      {active === "final" && <Finalresult />}
      {active === "marks" && <Totalmarks />}
   
    </Layout>
  );
}
