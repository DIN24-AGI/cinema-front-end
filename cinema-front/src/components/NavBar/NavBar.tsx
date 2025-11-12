import React from "react";
import { NavLink, useNavigate } from "react-router";
import styles from "./NavBar.module.css";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface NavbarProps {
	onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleLogout = () => {
		if (onLogout) onLogout();
		localStorage.removeItem("token");
		navigate("/admin/login");
	};

	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>🎞️ MovieAdmin</div>
			<ul className={styles.navLinks}>
				<li>
					<NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.home")}
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/movies" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.movies")}
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/cinemas" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.cinemas")}
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/halls" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.halls")}
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/data" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.data")}
					</NavLink>
				</li>
				<li>
					<NavLink to="/movie-list" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.movieList")}
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/change-password" className={({ isActive }) => (isActive ? styles.active : "")}>
						{t("nav.changePassword")}
					</NavLink>
				</li>
				<li>
					<LanguageSwitcher />
				</li>
			</ul>
			<button className={styles.logoutBtn} onClick={handleLogout}>
				{t("nav.logout")}
			</button>
		</nav>
	);
};

export default Navbar;
