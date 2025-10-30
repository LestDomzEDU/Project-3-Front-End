import React, { useEffect, useState } from "react";
import { View, Button, Alert, Text, ActivityIndicator, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const API_BASE =
  (process.env || {}).EXPO_PUBLIC_API_BASE ||
  (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function OAuthScreen() {
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);

  // (optional) force fresh login each run
  useEffect(() => {
    (async () => {
      await fetch(`${API_BASE}/api/logout`, { method: "POST", credentials: "include" }).catch(()=>{});
      const r = await fetch(`${API_BASE}/api/me`, { credentials: "include" }).catch(()=>null);
      if (r?.ok) setMe(await r.json());
    })();
  }, []);

  // ✅ Generate Expo proxy URL based on owner/slug
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
    projectNameForProxy: "gradquest",
    native: "gradquest://redirect",
  });

  const clientId = (process.env || {}).EXPO_PUBLIC_GITHUB_CLIENT_ID;
  console.log("clientId:", clientId);
  console.log("redirectUri:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId, redirectUri, scopes: ["read:user", "user:email"] },
    discovery
  );

  useEffect(() => { if (request?.url) console.log("auth URL:", request.url); }, [request]);

  useEffect(() => {
    (async () => {
      if (response?.type === "success" && response.params?.code) {
        setLoading(true);
        try {
          const r = await fetch(`${API_BASE}/api/mobile/github/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code: response.params.code, redirectUri }),
          });
          if (!r.ok) throw new Error(await r.text());

          const m = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
          if (!m.ok) throw new Error("Session not established");
          const j = await m.json();
          setMe(j);
          Alert.alert("Success", `Logged in as ${j?.name ?? "user"}`);
        } catch (e) {
          Alert.alert("Login Error", e?.message ?? String(e));
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [response]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>
        {me?.authenticated ? `Logged in as ${me?.name}` : "Not logged in"}
      </Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Continue with GitHub"
          disabled={!request}
          onPress={() => promptAsync({ useProxy: true, projectNameForProxy: "gradquest" })}
        />
      )}
    </View>
  );
}
