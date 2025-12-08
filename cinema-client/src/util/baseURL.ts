export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * BASE URL for WebSockets and HTTP requests
 */
export const API_ENDPOINTS = {
  base: API_BASE_URL, // <-- НУЖНО ДЛЯ WEBSOCKET

  cinemas: `${API_BASE_URL}/api/cinemas`,
  cities: `${API_BASE_URL}/api/cities`,
  movies: `${API_BASE_URL}/api/movies`,
  showtimes: `${API_BASE_URL}/api/client/showtimes`,
  showtime: `${API_BASE_URL}/api/client/showtimes`,
  seats: `${API_BASE_URL}/api/client/seats`,
  paymentCreateSession: `${API_BASE_URL}/payments/create-checkout-session`,
  showtimesInCinema: `${API_BASE_URL}/api/showtimes`,
};
