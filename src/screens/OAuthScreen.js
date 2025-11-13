import * as React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import API from '../lib/api';

// check if WebView is available
let WebView = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('WebView not available:', e);
  }
}

export default function OAuthScreen() {
  const navigation = useNavigation();
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // GitHub in-app WebView
  const [showWeb, setShowWeb] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState(null);

  // Clear server session once per app boot (forces a real login first time)
  const booted = React.useRef(false);
  const googleFreshNeeded = React.useRef(true); // only first Google login after boot
  React.useEffect(() => {
    (async () => {
      if (!booted.current) {
        booted.current = true;
        try { await fetch(API.LOGOUT, { method: 'POST', credentials: 'include' }); } catch {}
        await fetchMe();
      }
    })();
  }, []);

  const fetchMe = async () => {
    const res = await fetch(API.ME, { credentials: 'include' });
    return res.json().catch(() => ({ authenticated: false }));
  };

  // Poll /api/me until authenticated, or timeout
  const waitForAuth = async (ms = 10000) => {
    const start = Date.now();
    while (Date.now() - start < ms) {
      const data = await fetchMe();
      if (data?.authenticated) return data;
      await new Promise(r => setTimeout(r, 350));
    }
    return null;
  };

  // GitHub (seamless in-app WebView)
  const startLoginGithub = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // if web, redirect directly to GitHub OAuth
      window.location.href = API.LOGIN_GITHUB;
    } else if (Platform.OS !== 'web') {
      setLoginUrl(API.LOGIN_GITHUB);
      setShowWeb(true);
    }
  };

  // Google (secure Custom Tab → closes on /oauth2/final → wait for cookie → welcome page)
  const startLoginGoogle = async () => {
    try {
      setLoading(true);
      const url = API.LOGIN_GOOGLE;
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // if web, redirect directly to Google OAuth
        // same code as before just adding it to the web version
        window.location.href = url;
        return;
      } else {
        await WebBrowser.openAuthSessionAsync(url, API.OAUTH_FINAL);
        const authed = await waitForAuth();
        if (!authed) {
          Alert.alert('Sign-in', 'Still finishing sign-in… trying again.');
          const retry = await waitForAuth(5000);
          if (!retry) throw new Error('Could not verify sign-in.');
        }
        navigation.navigate('GoogleWelcome');
        googleFreshNeeded.current = false;
      }
    } catch (e) {
      Alert.alert('Google Sign-in failed', String(e));
    } finally {
      setLoading(false);
    }
  };

  const onNavChange = async (event) => {
    const url = event?.url || '';
    if (url.startsWith(API.OAUTH_FINAL) ||
        url.startsWith(API.ME) ||
        url === `${API.BASE}/` || url.startsWith(`${API.BASE}/?`)) {
      setShowWeb(false);
      setLoginUrl(null);
      const authed = await waitForAuth();
      if (!authed) await waitForAuth(5000);
      // Keep GitHub behavior (stay on this screen showing the signed-in panel)
      const latest = await fetchMe();
      setMe(latest);
    }
  };

  const doLogout = async () => {
    try {
      setLoading(true);
      await fetch(API.LOGOUT, { method: 'POST', credentials: 'include' });
      setMe({ authenticated: false });
      googleFreshNeeded.current = true; // next Google login should prompt again
    } catch (e) {
      Alert.alert('Logout failed', String(e));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { (async () => setMe(await fetchMe()))(); }, []);

  const Authenticated = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>You’re signed in</Text>
      {!!me?.avatar_url && (
        <Image source={{ uri: me.avatar_url }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 8 }} />
      )}
      <Text style={styles.sub}>{me?.login || me?.email || '(no username)'}</Text>

      <View style={{ height: 12 }} />
      <Button title="Go to app" onPress={() => navigation.navigate('Tabs')} />
      <View style={{ height: 8 }} />
      <Button title="Logout" color="#b00020" onPress={doLogout} />
    </View>
  );

  const Unauthenticated = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>Sign in</Text>
      {loading ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
      <Button title="Login with GitHub" onPress={startLoginGithub} />
      <View style={{ height: 8 }} />
      <Button title="Login with Google" onPress={startLoginGoogle} />
    </View>
  );

  return (
    <View style={styles.container}>
      {me?.authenticated ? <Authenticated /> : <Unauthenticated />}

      {showWeb && loginUrl && WebView ? (
        <View style={{ flex: 1, width: '100%', marginTop: 12 }}>
          <WebView
            key={loginUrl}
            source={{ uri: loginUrl }}
            onNavigationStateChange={onNavChange}
            startInLoadingState
            renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
          />
        </View>
      ) : null}
      {Platform.OS === 'web' && showWeb && loginUrl ? (
        <View style={{ flex: 1, width: '100%', marginTop: 12 }}>
          <iframe
            src={loginUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            onLoad={() => {
              // this is checking if the iframe navigated to the OAuth final URL
              setTimeout(() => {
                waitForAuth().then((authed) => {
                  if (authed) {
                    setShowWeb(false);
                    setLoginUrl(null);
                    fetchMe().then(setMe);
                  }
                });
              }, 2000);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  sub: { fontSize: 16, color: '#333', marginBottom: 4, textAlign: 'center' },
});
