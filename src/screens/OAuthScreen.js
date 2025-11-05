import * as React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import API from '../lib/api';

export default function OAuthScreen() {
  const navigation = useNavigation();
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showWeb, setShowWeb] = React.useState(false);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await fetch(API.ME, { credentials: 'include' });
      const data = await res.json();
      setMe(data);
      setLoading(false);

      if (data && data.authenticated === true) {
        // already logged in; if you prefer, jump to your Tabs:
        // navigation.navigate('Tabs');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', String(err));
    }
  };

  React.useEffect(() => { fetchMe(); }, []);

  const startLogin = () => {
    setShowWeb(true);
    Alert.alert('GitHub Login', 'Authorize in the web view, then this screen will update automatically.');
  };

  const onNavChange = (event) => {
    const url = event?.url || '';
    // After Spring finishes login, it redirects to /api/me (per our backend config).
    if (url.startsWith(`${API.BASE}/api/me`) || url === `${API.BASE}/` || url.startsWith(`${API.BASE}/?`)) {
      setShowWeb(false);
      fetchMe();
    }
  };

  const doLogout = async () => {
    try {
      setLoading(true);
      await fetch(API.LOGOUT, { method: 'POST', credentials: 'include' });
      setLoading(false);
      setMe({ authenticated: false });
      Alert.alert('Signed out', 'You have been logged out.');
    } catch (e) {
      setLoading(false);
      Alert.alert('Logout failed', String(e));
    }
  };

  const Authenticated = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>You’re signed in</Text>
      {!!me?.avatar_url && (
        <Image source={{ uri: me.avatar_url }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 8 }} />
      )}
      <Text style={styles.sub}>{me?.login || '(no username)'}</Text>

      <View style={{ height: 12 }} />
      <Button title="Go to app" onPress={() => navigation.navigate('Tabs')} />
      <View style={{ height: 8 }} />
      <Button title="Logout" color="#b00020" onPress={doLogout} />
      <View style={{ height: 12 }} />
      <Button title="Refresh status" onPress={fetchMe} />
    </View>
  );

  const Unauthenticated = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>Sign in with GitHub</Text>
      {loading ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
      <Button title="Login with GitHub" onPress={startLogin} />
      <View style={{ height: 10 }} />
      <Button title="Refresh status" onPress={fetchMe} />
    </View>
  );

  return (
    <View style={styles.container}>
      {me?.authenticated ? <Authenticated /> : <Unauthenticated />}

      <View style={{ width: '100%', marginTop: 16 }}>
        <Text style={styles.debug}>/api/me: {JSON.stringify(me)}</Text>
      </View>

      {showWeb ? (
        <View style={{ flex: 1, width: '100%', marginTop: 12 }}>
          <WebView
            source={{ uri: API.LOGIN }}
            onNavigationStateChange={onNavChange}
            startInLoadingState
            renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  sub: { fontSize: 16, color: '#333', marginBottom: 4 },
  debug: { fontSize: 12, color: '#666' },
});
