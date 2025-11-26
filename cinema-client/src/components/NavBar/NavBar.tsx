import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import styles from "./NavBar.module.css";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);



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
          to="/"
          onClick={closeNavbar}
        >
          🎞️ NorthStar
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
                to="/"
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
                to="/movies"
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
                to="/schedule"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.schedule")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? styles.active : ""}`
                }
                onClick={closeNavbar}
              >
                {t("nav.contact")}
              </NavLink>
            </li>
            
          </ul>

          <div className="d-flex align-items-center">
            <div className="me-3">
              <LanguageSwitcher />
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
