// src/screens/OAuthScreen.js
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
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

// Decide if /api/me response looks logged-in
const looksAuthenticated = (me) => {
  if (!me) return false;

  if (me.authenticated === true) return true;
  if (me.authenticated === false) return false;

  if (me.name || me.login || me.email || me.username) return true;

  return false;
};

export default function OAuthScreen() {
  const navigation = useNavigation();

  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [showWeb, setShowWeb] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState(null);
  const [webKey, setWebKey] = React.useState(0);

  // Track which provider the user chose ("github" | "discord" | null)
  const [currentProvider, setCurrentProvider] = React.useState(null);

  // For web polling after redirect
  const webPollRef = React.useRef(null);

  // Load /api/me and update state
  const loadMe = React.useCallback(async () => {
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      console.log("ME response:", data);
      setMe(data);
      return data;
    } catch (e) {
      console.warn("OAuthScreen: failed to load /api/me", e);
      setMe(null);
      return null;
    }
  }, []);

  // Cleanup only (no auto-login check on mount)
  React.useEffect(() => {
    return () => {
      if (webPollRef.current) {
        clearInterval(webPollRef.current);
        webPollRef.current = null;
      }
    };
  }, []);

  const isAuthed = looksAuthenticated(me);
  const avatarUri =
    me?.avatarUrl || me?.avatar_url || me?.picture || me?.avatar || null;

  const providerLabel =
    currentProvider === "github"
      ? "GitHub"
      : currentProvider === "discord"
      ? "Discord"
      : "your account";

  // When user taps "Continue to dashboard"
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

  // Start login: platform-specific behavior
  const startLogin = React.useCallback(
    async (provider) => {
      const base =
        provider === "github" ? API.LOGIN_GITHUB : API.LOGIN_DISCORD;

      // Remember which provider we are trying to use NOW
      setCurrentProvider(provider);

      // Reset any previous auth state in the UI
      setMe(null);
      setShowWeb(false);

      // Always log out the backend session before starting a new OAuth login
      try {
        await fetch(API.LOGOUT, {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        console.warn("OAuthScreen: LOGOUT before login failed (ignored)", e);
      }

      // WEB: open OAuth in a new tab & start polling /api/me
      if (Platform.OS === "web") {
        if (webPollRef.current) {
          clearInterval(webPollRef.current);
          webPollRef.current = null;
        }

        setLoading(true);
        Linking.openURL(base);

        let attempts = 0;
        const maxAttempts = 15; // ~30s

        webPollRef.current = setInterval(async () => {
          attempts += 1;
          const data = await loadMe();

          if (looksAuthenticated(data)) {
            clearInterval(webPollRef.current);
            webPollRef.current = null;
            setLoading(false);
            setShowWeb(false);
            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(webPollRef.current);
            webPollRef.current = null;
            setLoading(false);
          }
        }, 2000);

        return;
      }

      // NATIVE: use WebView inside the app
      setLoginUrl(base);
      setShowWeb(true);
      setWebKey((k) => k + 1);
    },
    [loadMe]
  );

  // Native WebView navigation handler
  const onWebNav = React.useCallback(
    async (navState) => {
      const url = navState?.url || "";
      if (url.startsWith(API.OAUTH_FINAL)) {
        setLoading(true);
        try {
          const data = await loadMe();
          console.log("After native OAuth, ME =", data);
        } finally {
          setLoading(false);
          setShowWeb(false);
        }
      }
    },
    [loadMe]
  );

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
        {/* If NOT authenticated and not inside WebView, show provider buttons */}
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

        {/* Loading spinner during web polling or native finalization */}
        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {/* After successful login: show confirmation + continue button */}
        {isAuthed && !showWeb && (
          <View style={styles.card}>
            {avatarUri && (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            )}
            <Text style={styles.title}>You’re signed in</Text>

            <Text style={styles.sub}>
              Signed in with {providerLabel}. Continue to your dashboard.
            </Text>

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

        {/* WebView for OAuth — native platforms only */}
        {Platform.OS !== "web" && showWeb && loginUrl && (
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

  logo: {
    width: 72,
    height: 72,
    resizeMode: "contain",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginTop: -100,
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
