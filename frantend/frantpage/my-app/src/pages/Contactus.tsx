import React from 'react'
import Hero from "../component/Contactus/Pageheading"
import Contactinf from "../component/Contactus/Contactinformation"
import ContactForm from '../component/Contactus/ContactForm'
import Map from "../component/Contactus/Map"
import Footer from './footer'               

export default function Contactus() {
  return (
    <div>
        <Hero/>
        <Contactinf/>
        <ContactForm/>
        <Map/>
        <Footer/>
    </div>
  )
}
