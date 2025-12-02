// src/screens/OAuthScreen.js
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../lib/api";

const TUTORIAL_KEY = "tutorial:completed";

export default function OAuthScreen() {
  const navigation = useNavigation();

  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // WebView is used for BOTH GitHub and Discord flows
  const [showWeb, setShowWeb] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState(null);
  const [webKey, setWebKey] = React.useState(0);

  // When we arrive at OAuth, always log out on the server
  // so the user must sign in again.
  React.useEffect(() => {
    (async () => {
      try {
        await fetch(API.LOGOUT, { method: "POST", credentials: "include" });
      } catch (e) {
        console.warn("OAuthScreen: LOGOUT failed (ignored)", e);
      } finally {
        setMe(null);
        setShowWeb(false);
        setLoginUrl(null);
        setWebKey((k) => k + 1);
      }
    })();
  }, []);

  /**
   * Load /api/me and put it into local state.
   * Called after we believe OAuth has completed.
   */
  const loadMe = React.useCallback(async () => {
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      console.log("OAuthScreen /api/me:", data);
      setMe(data);
    } catch (e) {
      console.warn("OAuthScreen: failed to load /api/me", e);
      setMe(null);
    }
  }, []);

  /**
   * Start login for a provider: "github" or "discord".
   * Both use in-app WebView so the UX is identical.
   */
  const startLogin = React.useCallback((provider) => {
    const base =
      provider === "github" ? API.LOGIN_GITHUB : API.LOGIN_DISCORD;

    // Use the base URL directly (no extra query params)
    const url = base;

    setLoginUrl(url);
    setShowWeb(true);
    setWebKey((k) => k + 1);
  }, []);

  /**
   * WebView navigation handler.
   * Once we see /oauth2/final, we close the WebView and fetch /api/me.
   */
  const onWebNav = React.useCallback(
    async (navState) => {
      const url = navState?.url || "";
      console.log("[OAuth WebView] url:", url);
      if (url.startsWith(API.OAUTH_FINAL)) {
        setShowWeb(false);
        setLoading(true);
        try {
          // Session is already established by the WebView hitting /oauth2/final
          await loadMe();
        } finally {
          setLoading(false);
        }
      }
    },
    [loadMe]
  );

  /**
   * Continue into the app after we have a user.
   * Still clears the tutorial flag like before.
   */
  const onContinue = React.useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_KEY);
    } catch (e) {
      console.warn("OAuthScreen: failed to clear tutorial key", e);
    }

    navigation.navigate("Tabs", {
      screen: "Dashboard",
      params: { showTutorial: true },
    });
  }, [navigation]);

  const avatarUri =
    (me &&
      (me.avatarUrl ||
        me.avatar_url ||
        me.picture ||
        me.avatar)) ||
    null;
  const hasAvatar = !!avatarUri;
  const isAuthed = !!me && me.authenticated === true;

  return (
    <View style={styles.container}>
      {/* Provider selection (only when not authenticated and no WebView) */}
      {!isAuthed && !showWeb && (
        <View style={{ width: "100%" }}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.sub}>Choose a provider to continue.</Text>

          <Pressable
            onPress={() => startLogin("github")}
            style={({ pressed }) => [
              styles.oauthBtn,
              styles.github,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.oauthBtnText}>Continue with GitHub</Text>
          </Pressable>

          <Pressable
            onPress={() => startLogin("discord")}
            style={({ pressed }) => [
              styles.oauthBtn,
              styles.discord,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.oauthBtnText}>Continue with Discord</Text>
          </Pressable>
        </View>
      )}

      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      {/* Post-login confirmation */}
      {isAuthed && !showWeb && (
        <View style={{ alignItems: "center", width: "100%" }}>
          {hasAvatar && (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          )}
          <Text style={styles.title}>You are authenticated</Text>
          {me?.name ? <Text style={styles.sub}>{me.name}</Text> : null}
          <Pressable
            onPress={onContinue}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.9 },
              { marginTop: 16 },
            ]}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {/* WebView login for GitHub & Discord */}
      {showWeb && loginUrl && (
        <View style={{ flex: 1, width: "100%" }}>
          <WebView
            key={webKey}
            source={{ uri: loginUrl }}
            originWhitelist={["*"]}
            javaScriptEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            onNavigationStateChange={onWebNav}
            startInLoadingState
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 8,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    textAlign: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: "#eeeeee",
  },
  oauthBtn: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    marginBottom: 10,
  },
  github: {
    backgroundColor: "#111827",
  },
  discord: {
    backgroundColor: "#5865F2",
  },
  oauthBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#00A7E1",
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
