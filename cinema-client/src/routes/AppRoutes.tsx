import { BrowserRouter as Router, Routes, Route } from "react-router";
import NavBar from "../components/NavBar/NavBar";

// Existing pages
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Schedule from "../pages/Schedule";
import Contact from "../pages/Contact";
import MovieDetails from "../pages/MovieDetails";

// New pages (you will create these)
import Cinemas from "../pages/Cinemas";
import CinemaDetails from "../pages/CinemaDetails";
import ShowtimePage from "../pages/ShowtimePage";
import SeatsPage from "../pages/SeatsPage.tsx";
import PaymentCancel from "../pages/PaymentCancel";
import PaymentSuccess from "../pages/PaymentSuccess";


const AppRoutes = () => {
  return (
    <Router>
      <NavBar />

      <div className="container-fluid d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "1200px" }}>
          <Routes>

            {/* ===========================
                HOME PAGE
               =========================== */}
            <Route path="/" element={<Home />} />

            {/* ===========================
                MOVIES LIST & MOVIE DETAILS
               =========================== */}
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:uid" element={<MovieDetails />} />

            {/* ===========================
                CINEMAS LIST
                Shows all available cinemas
               =========================== */}
            <Route path="/cinemas" element={<Cinemas />} />

            {/* ===========================
                SINGLE CINEMA PAGE
                Shows cinema info + link to schedule (dates)
               =========================== */}
            <Route path="/cinema/:cinema_uid" element={<CinemaDetails />} />

            {/* ===========================
                SHOWTIMES FOR A CINEMA ON A SPECIFIC DATE
                Uses: GET /showtimes?cinema_uid=...&date=...
               =========================== */}
            <Route
              path="/cinema/:cinema_uid/showtimes"
              element={<Schedule />}
            />
              <Route path="/schedule" element={<Schedule />} />
            {/* ===========================
                SINGLE SHOWTIME PAGE
                Shows movie info, hall info, prices, etc.
                Uses: GET /showtimes/:showtime_uid
               =========================== */}
            <Route
              path="/showtime/:showtime_uid"
              element={<ShowtimePage />}
            />

            {/* ===========================
                SEAT SELECTION PAGE
                Shows hall layout with reserved/sold/free seats
                Uses: GET /seats?showtime_uid=...
               =========================== */}
            <Route
              path="/showtime/:showtime_uid/seats"
              element={<SeatsPage />}
            />

            {/* ===========================
                STRIPE PAYMENT RESULT PAGES
               =========================== */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

            {/* ===========================
                CONTACT PAGE (existing)
               =========================== */}
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
