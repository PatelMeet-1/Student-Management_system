import React from 'react'
import Hero from '../component/About/AboutHero';
import Student from "../component/About/AboutStudentManagementSystem"
import MissionVisionSection from '../component/About/Visionmission';
import Choose from "../component/About/Choose"
import DeveloperInfoSection from '../component/About/Devloperinfo';
import Footer from '../pages/footer';

export default function About() {
  return (
    <div>

        <Hero/>
        <Student/>
        <MissionVisionSection/>
        <Choose/>
        <DeveloperInfoSection/>
        <Footer/>
    </div>
  )
}
