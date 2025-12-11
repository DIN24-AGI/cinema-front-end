import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		console.log(`Language changed to: ${lng}`);
	};

	return (
		<div className="btn-group" role="group">
			<button
				type="button"
				className={`btn btn-sm ${i18n.language === "en" ? "btn-primary" : "btn-outline-primary"}`}
				onClick={() => changeLanguage("en")}
			>
				EN
			</button>
			<button
				type="button"
				className={`btn btn-sm ${i18n.language === "fi" ? "btn-primary" : "btn-outline-primary"}`}
				onClick={() => changeLanguage("fi")}
			>
				FI
			</button>
			<button
				type="button"
				className={`btn btn-sm ${i18n.language === "pl" ? "btn-primary" : "btn-outline-primary"}`}
				onClick={() => changeLanguage("pl")}
			>
				PL
			</button>
		</div>
	);
};

export default LanguageSwitcher;
