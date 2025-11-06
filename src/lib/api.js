// src/lib/api.js
import { Platform } from 'react-native';

// Android emulators cannot reach localhost: use 10.0.2.2
const LOCAL_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const API = {
  BASE: process.env.EXPO_PUBLIC_API_BASE || LOCAL_BASE,
  get LOGIN()  { return `${this.BASE}/oauth2/authorization/github`; },
  get LOGOUT() { return `${this.BASE}/api/logout`; },   // <-- we'll use this
  get ME()     { return `${this.BASE}/api/me`; },
};

export default API;
