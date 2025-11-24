import { BrowserRouter as Router, Routes, } from "react-router";






const AppRoutes = () => {

  return (
    <Router>
      {/* Show navbar on all pages except login */}
      {/* <Navbar /> */}

      <div className="container-fluid d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "1200px" }}>
          <Routes>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
