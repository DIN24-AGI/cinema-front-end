import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import ChangePassword from "../pages/ChangePassword";
import MovieList from "../pages/MovieList";
import Navbar from "../components/NavBar/NavBar";
import ManageCinemas from "../pages/ManageCinemas";
import AddCinema from "../pages/AddCinema";
import CinemaDetails from "../pages/CinemaDetails";
import ManageHalls from "../pages/ManageHalls";
import HallDetails from "../pages/HallDetails";
import AddHall from "../pages/AddHall";
import ManageMovies from "../pages/ManageMovies";
import AddEditMovie from "../pages/AddEditMovie";
import ViewMovies from "../pages/ViewMovies";

interface AppRoutesProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const ProtectedResource: React.FC<{
  token: string | null;
  children: React.ReactNode;
}> = ({ token, children }) => {
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC<AppRoutesProps> = ({ token, setToken }) => {
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {/* Show navbar on all pages except login */}
      {token && <Navbar onLogout={handleLogout} />}

      <div className="container-fluid d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "1200px" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/movie-list" element={<MovieList />} />
            <Route
              path="/admin/login"
              element={<AdminLogin setToken={setToken} />}
            />
            <Route
              path="/admin/change-password"
              element={<ChangePassword token={token} setToken={setToken} />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedResource token={token}>
                  <AdminDashboard token={token} setToken={setToken} />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <ProtectedResource token={token}>
                  <ManageMovies />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/cinemas"
              element={
                <ProtectedResource token={token}>
                  <ManageCinemas />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/add-cinema"
              element={
                <ProtectedResource token={token}>
                  <AddCinema />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/cinemas/:id"
              element={
                <ProtectedResource token={token}>
                  <CinemaDetails />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/halls"
              element={
                <ProtectedResource token={token}>
                  <ManageHalls />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/data"
              element={
                <ProtectedResource token={token}>
                  <div>See Data Page</div>
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/halls/add"
              element={
                <ProtectedResource token={token}>
                  <AddHall />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/hall/:hallUid"
              element={
                <ProtectedResource token={token}>
                  <HallDetails />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/movies/add"
              element={
                <ProtectedResource token={token}>
                  <AddEditMovie />
                </ProtectedResource>
              }
            />
            <Route
              path="/admin/movies/edit/:id"
              element={
                <ProtectedResource token={token}>
                  <AddEditMovie />
                </ProtectedResource>
              }
            />
            <Route
              path="/movies"
              element={<ViewMovies/>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
