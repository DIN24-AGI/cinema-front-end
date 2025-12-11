// Import core i18next library for internationalization
import i18n from "i18next";

// Import React bindings for i18next to work with React components
import { initReactI18next } from "react-i18next";

// Import browser language detector to automatically detect user's preferred language
import LanguageDetector from "i18next-browser-languagedetector";

// Import English translation file
import translationEN from "../locales/en/translation.json";

// Import Finnish translation file
import translationFI from "../locales/fi/translation.json";

// import Polish translation file
import translationPL from "../locales/pl/translation.json";
/**
 * Define translation resources structure
 * Each language (en, fi) has a 'translation' namespace containing all translations
 * This allows i18next to access translations via t('key.path')
 */
const resources = {
	en: {
		translation: translationEN,
	},
	fi: {
		translation: translationFI,
	},
	pl: {
		translation: translationPL,
	},
};

/**
 * Initialize i18next with configuration
 *
 * Plugins:
 * - LanguageDetector: Automatically detects user's language from browser settings, localStorage, etc.
 * - initReactI18next: Passes i18n instance to react-i18next for use in React components
 */
i18n
	// Use language detector plugin to auto-detect user's preferred language
	.use(LanguageDetector)

	// Pass i18n instance to react-i18next to enable hooks like useTranslation()
	.use(initReactI18next)

	// Initialize i18next with configuration options
	.init({
		// Translation resources for all supported languages
		resources,

		// Fallback language if user's language is not available or translation key is missing
		fallbackLng: "en",

		// Enable debug mode in development to see missing translations and other warnings
		// Set to false in production
		debug: false,

		// Interpolation options
		interpolation: {
			// React already escapes values to prevent XSS attacks
			// Set to false to avoid double-escaping
			escapeValue: false,
		},

		// Additional optional configurations (not used here):
		// defaultNS: 'translation',        // Default namespace if not specified
		// ns: ['translation'],             // Available namespaces
		// keySeparator: '.',               // Separator for nested keys (e.g., 'nav.dashboard')
		// detection: {                     // Language detection options
		//   order: ['localStorage', 'navigator', 'htmlTag'],
		//   caches: ['localStorage']
		// }
	});

// Export configured i18n instance for use throughout the application
export default i18n;
