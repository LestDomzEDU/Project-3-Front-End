// src/lib/api.ts
import { Platform } from "react-native";

export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");

export const API = {
  BASE: API_BASE,
  MOBILE_GITHUB_CALLBACK: `${API_BASE}/api/mobile/github/callback`,
  ME: `${API_BASE}/api/me`,
};

export default API;
