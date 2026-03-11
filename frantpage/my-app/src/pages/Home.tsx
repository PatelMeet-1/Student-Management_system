import Navbar from "../pages/navbar";
import Hero from "../component/Home/herosection";
import Footer from "../pages/footer";
import Panel from "../component/Home/Panelsection"
import Features from "../component/Home/Features";
import Courses from "../component/Home/Course";
import Statistics from "../component/Home/Achievements";
// import Testimonials from "../component/Home/Testimonials";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Panel/>
      <Features/>
      <Courses/>
      <Statistics/>
      
      <Footer />
    </>
  );
}

export default App;