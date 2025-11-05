import React from "react";
import { NavLink, useNavigate } from "react-router";
import styles from "./NavBar.module.css";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        🎞️ MovieAdmin
      </div>
      <ul className={styles.navLinks}>
        <li><NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.active : ""}>Home</NavLink></li>
        <li><NavLink to="/admin/movies" className={({ isActive }) => isActive ? styles.active : ""}>Add Movies</NavLink></li>
        <li><NavLink to="/admin/theaters" className={({ isActive }) => isActive ? styles.active : ""}>Manage Theaters</NavLink></li>
        <li><NavLink to="/admin/halls" className={({ isActive }) => isActive ? styles.active : ""}>Manage Halls</NavLink></li>
        <li><NavLink to="/admin/data" className={({ isActive }) => isActive ? styles.active : ""}>See Data</NavLink></li>
      </ul>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
