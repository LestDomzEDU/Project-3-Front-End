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
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../lib/api";

const TUTORIAL_KEY = "tutorial:completed";

const PALETTE = {
  white: "#FFFFFF",
  blueDark: "#053F7C",
  blue: "#0061A8",
  blueSoft: "#E5F3FF",
  grayText: "#6B7280",
  gold: "#FFC727",

  githubBg: "#C7C7C7",
  discordBg: "#0D0D0D",
};

export default function OAuthScreen() {
  const navigation = useNavigation();

  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [showWeb, setShowWeb] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState(null);
  const [webKey, setWebKey] = React.useState(0);

  // ─────────────────────────────────────────
  // Initial: just check if there is an existing session
  // (do NOT auto-logout here – that’s what was causing the loop)
  // ─────────────────────────────────────────
  const loadMe = React.useCallback(async () => {
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      console.log("OAuthScreen /api/me =>", data);
      setMe(data);
    } catch (e) {
      console.warn("OAuthScreen: failed to load /api/me", e);
      setMe(null);
    }
  }, []);

  React.useEffect(() => {
    loadMe();
  }, [loadMe]);

  // ─────────────────────────────────────────
  // Start login with a specific provider
  // ─────────────────────────────────────────
  const startLogin = React.useCallback(
    async (provider) => {
      setLoading(true);
      setShowWeb(false);
      setLoginUrl(null);

      // Make sure any old session is cleared so switching
      // from GitHub ↔ Discord doesn’t confuse things.
      try {
        await fetch(API.LOGOUT, { method: "POST", credentials: "include" });
      } catch (e) {
        console.warn("OAuthScreen: LOGOUT before login failed (ignored)", e);
      }

      const base =
        provider === "github" ? API.LOGIN_GITHUB : API.LOGIN_DISCORD;

      setMe(null); // we’re starting a fresh login
      setLoginUrl(base);
      setShowWeb(true);
      setWebKey((k) => k + 1);
      setLoading(false);
    },
    []
  );

  // ─────────────────────────────────────────
  // Handle navigation events inside the WebView
  // ─────────────────────────────────────────
  const onWebNav = React.useCallback(
    async (navState) => {
      const url = navState?.url || "";
      // When backend redirects to the final URL, we consider OAuth done.
      if (url.startsWith(API.OAUTH_FINAL)) {
        setShowWeb(false);
        setLoading(true);
        try {
          await loadMe();
        } finally {
          setLoading(false);
        }
      }
    },
    [loadMe]
  );

  // ─────────────────────────────────────────
  // After successful login, continue into the app
  // ─────────────────────────────────────────
  const onContinue = React.useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_KEY);
    } catch (e) {
      // ignore
    }

    navigation.navigate("Tabs", {
      screen: "Dashboard",
      params: { showTutorial: true },
    });
  }, [navigation]);

  const avatarUri =
    me?.avatarUrl || me?.avatar_url || me?.picture || me?.avatar || null;

  const isAuthed = !!me && me.authenticated;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Sign in</Text>
        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.headerAccent} />

      <View style={styles.content}>
        {/* Initial state: choose provider */}
        {!isAuthed && !showWeb && (
          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.sub}>
              Choose a provider to continue to your dashboard.
            </Text>
            <Text style={styles.subLabel}>Sign in with:</Text>

            {/* GitHub button */}
            <Pressable
              onPress={() => startLogin("github")}
              style={({ pressed }) => [
                styles.oauthBtn,
                styles.githubBtn,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Image
                source={require("../../assets/github_horizontal.png")}
                style={styles.horizontalLogo}
              />
            </Pressable>

            <Text style={styles.orText}>--- or ---</Text>

            {/* Discord button */}
            <Pressable
              onPress={() => startLogin("discord")}
              style={({ pressed }) => [
                styles.oauthBtn,
                styles.discordBtn,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Image
                source={require("../../assets/discord_horizontal.png")}
                style={styles.horizontalLogo}
              />
            </Pressable>
          </View>
        )}

        {/* Loading indicator while we’re fetching /api/me */}
        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {/* After login */}
        {isAuthed && !showWeb && (
          <View style={styles.card}>
            {avatarUri && (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            )}
            <Text style={styles.title}>You’re signed in</Text>

            {me?.name ? (
              <Text style={styles.sub}>Welcome, {me.name}!</Text>
            ) : (
              <Text style={styles.sub}>
                Your session has been created successfully.
              </Text>
            )}

            <Pressable
              onPress={onContinue}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={styles.primaryBtnText}>Continue to dashboard</Text>
            </Pressable>
          </View>
        )}

        {/* WebView for OAuth (native platforms) */}
        {showWeb && loginUrl && (
          <View style={styles.webContainer}>
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
    </SafeAreaView>
  );
}

/* ==============================
   STYLES
   ============================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.white,
  },

  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: PALETTE.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerAccent: {
    height: 4,
    backgroundColor: PALETTE.gold,
    width: "100%",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: PALETTE.blueDark,
  },

  // Bigger logo
  logo: {
    width: 72,
    height: 72,
    resizeMode: "contain",
  },

  // Center the card vertically
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginTop: -100, // move card UP
  },

  card: {
    width: "100%",
    backgroundColor: PALETTE.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    color: PALETTE.blueDark,
  },

  sub: {
    fontSize: 14,
    color: PALETTE.grayText,
    marginBottom: 4,
    textAlign: "center",
  },

  subLabel: {
    fontSize: 13,
    color: PALETTE.grayText,
    marginBottom: 14,
    textAlign: "center",
  },

  oauthBtn: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  githubBtn: {
    backgroundColor: PALETTE.githubBg,
  },

  discordBtn: {
    backgroundColor: PALETTE.discordBg,
  },

  horizontalLogo: {
    width: "70%",
    height: 28,
    resizeMode: "contain",
  },

  orText: {
    textAlign: "center",
    color: PALETTE.grayText,
    fontSize: 12,
    marginVertical: 6,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
    alignSelf: "center",
    backgroundColor: "#eeeeee",
  },

  primaryBtn: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: PALETTE.blue,
    alignItems: "center",
  },

  primaryBtnText: {
    color: PALETTE.white,
    fontWeight: "700",
    fontSize: 15,
  },

  webContainer: {
    flex: 1,
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: PALETTE.blueSoft,
  },
});
