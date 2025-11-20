// lib/api.js
import { Platform } from "react-native";

const LOCAL_ANDROID = "http://10.0.2.2:3000";
const LOCAL_IOS = "http://localhost:3000";
const BASE = __DEV__
  ? Platform.select({ ios: LOCAL_IOS, android: LOCAL_ANDROID })
  : "https://your-production-domain.com";

const API = {
  BASE,
  LOGIN_GITHUB: `${BASE}/auth/github`,
  LOGIN_GOOGLE: `${BASE}/auth/google`,
  OAUTH_FINAL:  `${BASE}/auth/finalize`,   // ← this is the constant used in OAuthScreen.js
  ME:           `${BASE}/me`,
  LOGOUT:       `${BASE}/logout`,
};

export default API;
