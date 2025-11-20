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
import API from "../lib/api";

/**
 * In-app OAuth screen with embedded WebView.
 * - Tapping a provider button reveals an in-app browser panel under the buttons.
 * - We watch navigations; when the URL reaches API.OAUTH_FINAL, we stop loading,
 *   close the WebView, and finalize the session via fetch().
 * - No system browser is opened.
 */
export default function OAuthScreen() {
  const navigation = useNavigation();

  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // WebView controls
  const [showWeb, setShowWeb] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState(null);
  const [webKey, setWebKey] = React.useState(0); // force a fresh instance

  // Make sure we start clean (fresh session)
  React.useEffect(() => {
    (async () => {
      try {
        await fetch(API.LOGOUT, { method: "POST", credentials: "include" });
      } catch {}
      setMe(null);
      setShowWeb(false);
      setLoginUrl(null);
      setWebKey((k) => k + 1);
    })();
  }, []);

  const startLogin = (provider) => {
    const base = provider === "github" ? API.LOGIN_GITHUB : API.LOGIN_GOOGLE;
    // Small nudge to always prompt account selection:
    const forced =
      provider === "github"
        ? `${base}?prompt=login`
        : `${base}?prompt=select_account`;

    setLoginUrl(forced);
    setShowWeb(true);
    setWebKey((k) => k + 1);
  };

  const finalizeInApp = async () => {
    // Complete the server-side finalize step and then fetch the user session
    try {
      await fetch(API.OAUTH_FINAL, { credentials: "include" });
    } catch {}
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      setMe(data || null);
    } catch {
      setMe(null);
    }
  };

  // Intercept navigations inside WebView
  const onShouldStart = (req) => {
    const url = req?.url || "";
    // When the provider finishes and your backend redirects to the finalizer,
    // we stop the WebView and finish the flow in-app.
    if (url.startsWith(API.OAUTH_FINAL)) {
      setLoading(true);
      setShowWeb(false);
      setLoginUrl(null);
      // finalize after a tick so WebView unmounts cleanly
      setTimeout(async () => {
        await finalizeInApp();
        setLoading(false);
      }, 0);
      return false; // block the WebView from navigating to the final URL
    }
    return true;
  };

  const onContinue = () => {
    navigation.navigate("ProfileIntake");
  };

  const closeWeb = () => {
    setShowWeb(false);
    setLoginUrl(null);
  };

  return (
    <View style={styles.container}>
      {/* Header / Buttons */}
      <View style={{ width: "100%" }}>
        {!me ? (
          <>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.sub}>Choose a provider to continue.</Text>

            <Pressable
              onPress={() => startLogin("github")}
              style={[styles.oauthBtn, styles.github]}
            >
              <Text style={styles.oauthBtnText}>Continue with GitHub</Text>
            </Pressable>

            <Pressable
              onPress={() => startLogin("google")}
              style={[styles.oauthBtn, styles.google]}
            >
              <Text style={styles.oauthBtnText}>Continue with Google</Text>
            </Pressable>
          </>
        ) : (
          <View style={{ alignItems: "center", width: "100%" }}>
            {(me.avatarUrl || me.avatar_url || me.picture) ? (
              <Image
                source={{ uri: me.avatarUrl || me.avatar_url || me.picture }}
                style={styles.avatar}
              />
            ) : null}
            <Text style={styles.title}>You're signed in</Text>
            {me.name ? <Text style={styles.sub}>{me.name}</Text> : null}
            <Pressable onPress={onContinue} style={[styles.primaryBtn, { marginTop: 16 }]}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Built-in browser panel (appears UNDER the buttons) */}
      {showWeb && loginUrl ? (
        <View style={styles.webPanel}>
          <View style={styles.webPanelHeader}>
            <Text style={styles.webPanelTitle}>Secure sign-in</Text>
            <Pressable onPress={closeWeb} style={styles.close}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <WebView
            key={webKey}
            source={{ uri: loginUrl }}
            // keep state isolated each time
            incognito
            cacheEnabled={false}
            // enable cookie sharing so your API session persists in fetch()
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            // intercept redirects to the finalizer
            onShouldStartLoadWithRequest={onShouldStart}
            startInLoadingState
          />
        </View>
      ) : null}

      {loading ? <ActivityIndicator size="large" style={{ marginTop: 16 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8, marginTop: 8, textAlign: "center" },
  sub: { fontSize: 16, color: "#333", marginBottom: 4, textAlign: "center" },
  avatar: { width: 96, height: 96, borderRadius: 48, marginVertical: 8, backgroundColor: "#eee" },

  oauthBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  github: { backgroundColor: "#111827" },
  google: { backgroundColor: "#1F2937" },
  oauthBtnText: { color: "#fff", fontWeight: "700" },

  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#00A7E1",
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  // Web panel styles
  webPanel: {
    width: "100%",
    height: 420, // visible area under the buttons
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  webPanelHeader: {
    height: 44,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  webPanelTitle: { fontWeight: "700", color: "#111827" },
  close: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  closeText: { fontWeight: "700", color: "#111827" },
});
