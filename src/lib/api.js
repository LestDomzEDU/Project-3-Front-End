import { Platform } from 'react-native';

const DEFAULT_BASE =
  Platform.OS === 'android' ? 'http://localhost:8080' : 'http://localhost:8080';

export const API = {
  BASE: process.env.EXPO_PUBLIC_API_BASE || DEFAULT_BASE,
  // GitHub
  get LOGIN_GITHUB()        { return `${this.BASE}/oauth2/authorization/github`; },
  // Google (normal & “fresh” variants if you still want first-boot prompt)
  get LOGIN_GOOGLE()        { return `${this.BASE}/oauth2/authorization/google`; },
  get LOGIN_GOOGLE_FRESH()  { return `${this.BASE}/oauth2/authorization/google?fresh=1`; },

  get OAUTH_FINAL()         { return `${this.BASE}/oauth2/final`; },
  get LOGOUT()              { return `${this.BASE}/api/logout`; },
  get ME()                  { return `${this.BASE}/api/me`; },
};

export default API;
