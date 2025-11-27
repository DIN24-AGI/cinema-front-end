import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Schedule from "../pages/Schedule";
import Contact from "../pages/Contact";
import NavBar from "../components/NavBar/NavBar"
import MovieDetails from "../pages/MovieDetails"

const AppRoutes = () => {

  return (
    <Router>
      <NavBar />

      <div className="container-fluid d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "1200px" }}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="movies" element={<Movies />}></Route>
            <Route path="schedule" element={<Schedule />}></Route>
            <Route path="contact" element={<Contact />}></Route>
            <Route path="movies/:uid" element={<MovieDetails />}> </Route>
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
