import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import styles from "./NavBar.module.css";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container-fluid">
        <NavLink
          className={`navbar-brand ${styles.logo}`}
          to="/admin/dashboard"
          onClick={closeNavbar}
        >
          🎞️ MovieAdmin
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ borderColor: "#e5e7eb" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${styles.navLinks}`}>
            <li className="nav-item">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.home")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/movies"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.movies")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/cinemas"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.cinemas")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/halls"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.halls")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/data"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.data")}
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                to="/movie-list"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.movieList")}
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink
                to="/admin/change-password"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.changePassword")}
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="me-3">
              <LanguageSwitcher />
            </div>
            <button
              className={`btn ${styles.logoutBtn}`}
              onClick={handleLogout}
            >
              {t("nav.logout")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
