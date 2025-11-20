const DEFAULT_BASE = 'https://grad-quest-app-2cac63f2b9b2.herokuapp.com';
export const API = {
  BASE: process.env.EXPO_PUBLIC_API_BASE || DEFAULT_BASE,
  // OAuth endpoints
  get LOGIN_GITHUB() { return `${this.BASE}/oauth2/authorization/github`; },
  get LOGIN_GOOGLE() { return `${this.BASE}/oauth2/authorization/google`; },
  get OAUTH_FINAL()  { return `${this.BASE}/oauth2/final`; },
  // Session endpoints
  get LOGOUT() { return `${this.BASE}/api/logout`; },
  get ME()     { return `${this.BASE}/api/me`; },
};
export default API;