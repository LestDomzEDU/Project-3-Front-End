import * as React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import API from '../lib/api';
export default function OAuthScreen() {
  const navigation = useNavigation();
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  // In-app WebView for provider login (fully incognito)
  const [showWeb, setShowWeb] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState(null);
  const [webKey, setWebKey] = React.useState(0); // force a fresh WebView instance
  // Always require explicit login: clear app session on mount
  React.useEffect(() => {
    (async () => {
      try { await fetch(API.LOGOUT, { method: 'POST', credentials: 'include' }); } catch (e) {}
      setMe(null);
      setShowWeb(false);
      setLoginUrl(null);
      setWebKey((k) => k + 1);
    })();
  }, []);
  const startLogin = (provider) => {
    // Force the provider to prompt account selection / login each time
    const base = provider === 'github' ? API.LOGIN_GITHUB : API.LOGIN_GOOGLE;
    const forced = provider === 'github'
      ? `${base}?prompt=login`
      : `${base}?prompt=select_account`;
    setLoginUrl(forced);
    setShowWeb(true);
    setWebKey((k) => k + 1); // ensure no cookie reuse
  };
  const finalize = async () => {
    // Try opening finalizer in system browser to persist cookies if needed
    try { await WebBrowser.openBrowserAsync(API.OAUTH_FINAL); } catch (e) {}
    try { await fetch(API.OAUTH_FINAL, { credentials: 'include' }); } catch (e) {}
    // Fetch session/me after OAuth
    try {
      const res = await fetch(API.ME, { credentials: 'include' });
      const data = await res.json();
      // Log user ID after successful login
      if (data?.authenticated) {
        const userId = data.userId || data.id;
        console.log('UserId:', userId);
      }
      setMe(data);
    } catch (e) {
      setMe(null);
    }
  };
  const onWebNav = async (navState) => {
    const url = navState?.url || '';
    if (url.startsWith(API.OAUTH_FINAL)) {
      setShowWeb(false);
      setLoading(true);
      await finalize();
      setLoading(false);
      navigation.navigate('Loading');
    }
  };
  const onContinue = () => {
    navigation.navigate('ProfileIntake');
  };
  return (
    <View style={styles.container}>
      {!me && !showWeb && (
        <View style={{ width: '100%' }}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.sub}>Choose a provider to continue.</Text>
          <Pressable onPress={() => startLogin('github')} style={[styles.oauthBtn, styles.github]}>
            <Text style={styles.oauthBtnText}>Continue with GitHub</Text>
          </Pressable>
          <Pressable onPress={() => startLogin('google')} style={[styles.oauthBtn, styles.google]}>
            <Text style={styles.oauthBtnText}>Continue with Google</Text>
          </Pressable>
        </View>
      )}
      {loading ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : null}
      {me && !showWeb && (
        <View style={{ alignItems: 'center', width: '100%' }}>
          {(me.avatarUrl || me.avatar_url || me.picture) ? (
            <Image source={{ uri: me.avatarUrl || me.avatar_url || me.picture }} style={styles.avatar} />
          ) : null}
          <Text style={styles.title}>You're signed in</Text>
          {me.name ? <Text style={styles.sub}>{me.name}</Text> : null}
          <Pressable onPress={onContinue} style={[styles.primaryBtn, { marginTop: 16 }]}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>
        </View>
      )}
      {showWeb && loginUrl ? (
        <View style={{ flex: 1, width: '100%' }}>
          <WebView
            key={webKey}
            source={{ uri: loginUrl }}
            // Make it truly fresh every time:
            incognito={true}
            cacheEnabled={false}
            sharedCookiesEnabled={false}
            thirdPartyCookiesEnabled={false}
            onNavigationStateChange={onWebNav}
            startInLoadingState
          />
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, marginTop: 8, textAlign: 'center' },
  sub: { fontSize: 16, color: '#333', marginBottom: 4, textAlign: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, marginVertical: 8, backgroundColor: '#eee' },
  oauthBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  github: { backgroundColor: '#111827' },
  google: { backgroundColor: '#1F2937' },
  oauthBtnText: { color: '#fff', fontWeight: '700' },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#00A7E1',
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});