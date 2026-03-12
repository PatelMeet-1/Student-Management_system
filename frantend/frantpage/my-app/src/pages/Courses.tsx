import React from 'react'
import Header from "../component/Courses/PageHeader"
import Course from "../component/Courses/Courselist"
import CourseDetail from  "../component/Courses/CourseDetails"
import EnrollmentCTA from '../component/Courses/Enrollementsec'
import Footer from './footer'

export default function Courses() {
  return (
    <div>
        <Header/>
        <Course/>
        <CourseDetail/>
        <EnrollmentCTA/>
        <Footer/>
    </div>
  )
}
