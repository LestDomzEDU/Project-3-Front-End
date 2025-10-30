import React, { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import API from "../src/lib/api";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function OAuthScreen() {
  const router = useRouter();
  AuthSession.maybeCompleteAuthSession();

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      redirectUri,
      scopes: ["read:user", "user:email"],
    },
    discovery
  );

  useEffect(() => {
    (async () => {
      if (response?.type === "success" && response.params?.code) {
        try {
          const r = await fetch(API.MOBILE_GITHUB_CALLBACK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code: response.params.code, redirectUri }),
          });
          if (!r.ok) throw new Error(await r.text());
          const me = await fetch(API.ME, { credentials: "include" });
          if (!me.ok) throw new Error("Session not established");
          router.replace("/"); // change to your home route
        } catch (e:any) {
          Alert.alert("Login Error", e?.message ?? String(e));
        }
      }
    })();
  }, [response]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Continue with GitHub" disabled={!request} onPress={() => promptAsync({ useProxy: true })}/>
    </View>
  );
}
