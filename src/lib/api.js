// src/lib/api.js
// One source of truth for backend endpoints (Heroku).

const BASE = "https://grad-quest-app-2cac63f2b9b2.herokuapp.com";

export default {
  BASE,
  // 👉 point GitHub auth to Spring’s OAuth2 authorization endpoint
  LOGIN_GITHUB: `${BASE}/oauth2/authorization/github`,
  // Leave Google untouched (ignore if you’re not using it)
  LOGIN_GOOGLE: `${BASE}/auth/google`,
  // If your backend exposes a finalize route, keep it here.
  // (The screen below doesn’t require it, but will try it if present.)
  OAUTH_FINAL:  `${BASE}/auth/finalize`,
  ME:           `${BASE}/me`,
  LOGOUT:       `${BASE}/logout`,
};
