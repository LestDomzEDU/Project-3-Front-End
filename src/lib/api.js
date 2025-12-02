// src/lib/api.js

// Your deployed backend (Heroku)
const BASE_URL = "https://grad-quest-app-2cac63f2b9b2.herokuapp.com";

// All API endpoints used across the app
const API = {
  // --- OAuth2 login endpoints ---
  // Spring Security exposes these automatically for each provider:
  LOGIN_GITHUB: `${BASE_URL}/oauth2/authorization/github`,
  LOGIN_DISCORD: `${BASE_URL}/oauth2/authorization/discord`,

  // Called by OAuthScreen after the provider redirects back
  OAUTH_FINAL: `${BASE_URL}/oauth2/final`,

  // --- User session endpoints ---
  ME: `${BASE_URL}/api/me`,
  LOGOUT: `${BASE_URL}/logout`,

  // --- Your existing API routes (if needed throughout the app) ---
  BASE: BASE_URL,

  // If you later add more routes, follow this pattern:
  // EXAMPLE: `${BASE_URL}/api/something`
};

export default API;
