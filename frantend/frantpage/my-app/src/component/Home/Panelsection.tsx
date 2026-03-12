import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Panels: React.FC = () => {
    useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });

    AOS.refresh();
  }, []);
  
  return (
    <section className="py-5" style={{ backgroundColor: "#E2E2E2" }}>
      <div className="container text-center">

        <h2 className="fw-bold mb-3" style={{ color: "#19747E" }}>
          Student Portal
        </h2>

        <p className="mb-5" style={{ color: "#19747E", fontSize: "1.1rem" }}>
          Access academic services, stay updated with announcements and manage
          your college activities easily through the student portal.
        </p>

        <div
        data-aos="zoom-in"
          id="panelsCarousel"
          className="carousel slide shadow mx-auto"
          data-bs-ride="carousel"
          style={{
            background: "linear-gradient(135deg, #D1E8E2 0%, #A9D6E5 100%)",
            borderRadius: "20px",
            maxWidth: "750px",
            height: "480px",
            boxShadow: "0 20px 40px rgba(25,116,126,0.15)"
          }}
        >
          <div className="carousel-inner h-100">

            {/* Slide 1 */}
            <div className="carousel-item active h-100">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5">

                <div
                  style={{
                    backgroundColor: "#19747E",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "30px"
                  }}
                >
                  <i className="bi bi-mortarboard" style={{ fontSize: "50px", color: "white" }}></i>
                </div>

                <h3 className="mb-4 fw-bold" style={{ color: "#19747E", fontSize: "2.2rem" }}>
                  Academic Services
                </h3>

                <p className="lead mb-5 px-4" style={{ color: "#19747E", maxWidth: "500px" }}>
                  Access academic information, check updates and manage your
                  college activities easily in one place.
                </p>

                <button
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "18px",
                    border: "none"
                  }}
                >
                  Explore →
                </button>

              </div>
            </div>

            {/* Slide 2 */}
            <div className="carousel-item h-100">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5">

                <div
                  style={{
                    backgroundColor: "#19747E",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "30px"
                  }}
                >
                  <i className="bi bi-journal-bookmark" style={{ fontSize: "50px", color: "white" }}></i>
                </div>

                <h3 className="mb-4 fw-bold" style={{ color: "#19747E", fontSize: "2.2rem" }}>
                  Course Information
                </h3>

                <p className="lead mb-5 px-4" style={{ color: "#19747E", maxWidth: "500px" }}>
                  View course details, academic resources and important
                  information related to your studies.
                </p>

                <button
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "18px",
                    border: "none"
                  }}
                >
                  Explore →
                </button>

              </div>
            </div>

            {/* Slide 3 */}
            <div className="carousel-item h-100">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5">

                <div
                  style={{
                    backgroundColor: "#19747E",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "30px"
                  }}
                >
                  <i className="bi bi-bell" style={{ fontSize: "50px", color: "white" }}></i>
                </div>

                <h3 className="mb-4 fw-bold" style={{ color: "#19747E", fontSize: "2.2rem" }}>
                  Notifications
                </h3>

                <p className="lead mb-5 px-4" style={{ color: "#19747E", maxWidth: "500px" }}>
                  Stay informed with announcements, academic updates and
                  important notifications from your institution.
                </p>

                <button
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "18px",
                    border: "none"
                  }}
                >
                  Explore →
                </button>

              </div>
            </div>

          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#panelsCarousel"
            data-bs-slide="prev"
            style={{ width: "50px", opacity: 0.7 }}
          >
            <span className="carousel-control-prev-icon" style={{ backgroundColor: "#19747E" }}></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#panelsCarousel"
            data-bs-slide="next"
            style={{ width: "50px", opacity: 0.7 }}
          >
            <span className="carousel-control-next-icon" style={{ backgroundColor: "#19747E" }}></span>
          </button>

          {/* Indicators */}
          <div className="carousel-indicators" style={{ bottom: "-60px" }}>
            <button type="button" data-bs-target="#panelsCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#panelsCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#panelsCarousel" data-bs-slide-to="2"></button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Panels;