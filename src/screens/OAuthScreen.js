import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import API from "../lib/api";

// Are we back on our own origin (not still on the auth-start page)?
function isBackOnApp(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const b = new URL(API.BASE);
    const sameOrigin = u.origin === b.origin;
    const path = u.pathname || "/";

    // still inside the "start" route? (Spring OAuth2)
    const stillAtAuthStart = path.startsWith("/oauth2/authorization/");
    return sameOrigin && !stillAtAuthStart;
  } catch {
    return false;
  }
}

export default function OAuthScreen() {
  const navigation = useNavigation();

  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // WebView state (GitHub only)
  const [showWeb, setShowWeb] = React.useState(false);
  const [webKey, setWebKey] = React.useState(0);
  const [currentUrl, setCurrentUrl] = React.useState(null);

  // Clean slate on mount
  React.useEffect(() => {
    (async () => {
      try { await fetch(API.LOGOUT, { method: "POST", credentials: "include" }); } catch {}
      setMe(null);
      setShowWeb(false);
      setWebKey((k) => k + 1);
      setCurrentUrl(null);
    })();
  }, []);

  const startGithubLogin = () => {
    setShowWeb(true);
    setWebKey((k) => k + 1);
    setCurrentUrl(API.LOGIN_GITHUB);
  };

  // Show Google button again; open in WebView too, but we won't wire post-login for it yet
  const startGoogleLogin = () => {
    // Optional: open in the same in-app panel for parity (can remove if you truly want to ignore)
    if (!API.LOGIN_GOOGLE) return;
    setShowWeb(true);
    setWebKey((k) => k + 1);
    setCurrentUrl(API.LOGIN_GOOGLE);
  };

  const finalizeAndGoToDashboard = async () => {
    setLoading(true);
    try {
      // If your backend exposes a finalize endpoint, hit it (harmless if it no-ops)
      if (API.OAUTH_FINAL) {
        await fetch(API.OAUTH_FINAL, { credentials: "include" });
      }
    } catch {}

    let user = null;
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      user = await res.json();
    } catch {}

    setMe(user || null);
    setLoading(false);

    // Navigate to Tabs → Dashboard regardless; if user is null, your Settings can still show "Unknown"
    navigation.reset({
      index: 0,
      routes: [{ name: "Tabs", params: { screen: "Dashboard" } }],
    });
  };

  const handleShouldStart = (req) => {
    const url = req?.url || "";
    setCurrentUrl(url);

    if (isBackOnApp(url)) {
      setShowWeb(false);
      // finish in-app after WebView unmounts (iOS quirk)
      setTimeout(finalizeAndGoToDashboard, 0);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      {/* Header / Buttons */}
      <View style={{ width: "100%" }}>
        {!me ? (
          <>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.sub}>Choose a provider to continue.</Text>

            <Pressable onPress={startGithubLogin} style={[styles.oauthBtn, styles.github]}>
              <Text style={styles.oauthBtnText}>Continue with GitHub</Text>
            </Pressable>

            {/* Restored Google button (opens its URL; no extra handling for now) */}
            <Pressable onPress={startGoogleLogin} style={[styles.oauthBtn, styles.google]}>
              <Text style={styles.oauthBtnText}>Continue with Google</Text>
            </Pressable>

            {__DEV__ && currentUrl ? (
              <Text style={styles.devUrl} numberOfLines={2}>
                {Platform.select({ ios: "iOS", android: "Android" })} WebView → {currentUrl}
              </Text>
            ) : null}
          </>
        ) : (
          <View style={{ alignItems: "center", width: "100%" }}>
            {(me?.avatarUrl || me?.avatar_url || me?.picture) ? (
              <Image
                source={{ uri: me.avatarUrl || me.avatar_url || me.picture }}
                style={styles.avatar}
              />
            ) : null}
            <Text style={styles.title}>You're signed in</Text>
            {me?.name ? <Text style={styles.sub}>{me.name}</Text> : null}
          </View>
        )}
      </View>

      {/* Built-in browser (under the buttons) */}
      {showWeb ? (
        <View style={styles.webPanel}>
          <View style={styles.webPanelHeader}>
            <Text style={styles.webPanelTitle}>Secure sign-in</Text>
            <Pressable onPress={() => setShowWeb(false)} style={styles.close}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <WebView
            key={webKey}
            source={{ uri: currentUrl || API.LOGIN_GITHUB }}
            incognito
            cacheEnabled={false}
            // share cookies with fetch() so the session cookie is visible
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            onShouldStartLoadWithRequest={handleShouldStart}
            onNavigationStateChange={(s) => setCurrentUrl(s?.url)}
            startInLoadingState
            originWhitelist={["*"]}
            bounces={false}
          />
        </View>
      ) : null}

      {loading ? <ActivityIndicator size="large" style={{ marginTop: 16 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8, marginTop: 8, textAlign: "center" },
  sub: { fontSize: 16, color: "#333", marginBottom: 4, textAlign: "center" },
  devUrl: { marginTop: 10, fontSize: 12, color: "#6B7280" },
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

  // Web panel
  webPanel: {
    width: "100%",
    height: 420,
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
  close: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "#F3F4F6" },
  closeText: { fontWeight: "700", color: "#111827" },
});
