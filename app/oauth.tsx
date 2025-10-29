// app/oauth.tsx
import React, { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import API from "../src/lib/api";

// GitHub OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function OAuthScreen() {
  const router = useRouter();

  // Ensure web auth sessions complete
  AuthSession.maybeCompleteAuthSession();

  // Expo proxy lets this work inside Expo Go (no custom scheme needed)
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!, // set via env var
      redirectUri,
      scopes: ["read:user", "user:email"],
    },
    discovery
  );

  useEffect(() => {
    (async () => {
      if (response?.type === "success" && response.params?.code) {
        try {
          // 1) Send the authorization code to your backend
          const r = await fetch(API.MOBILE_GITHUB_CALLBACK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              code: response.params.code,
              redirectUri, // must match what GitHub used
            }),
          });
          if (!r.ok) {
            const txt = await r.text();
            throw new Error(`Backend auth failed: ${r.status} ${txt}`);
          }

          // 2) Verify session
          const me = await fetch(API.ME, { credentials: "include" });
          if (!me.ok) throw new Error("Session not established after login");

          // 3) Navigate into your app
          router.replace("/"); // change to your home route
        } catch (err: any) {
          Alert.alert("Login Error", err?.message ?? String(err));
        }
      }
    })();
  }, [response]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Button
        title="Continue with GitHub"
        disabled={!request}
        onPress={() => promptAsync({ useProxy: true })}
      />
    </View>
  );
}
