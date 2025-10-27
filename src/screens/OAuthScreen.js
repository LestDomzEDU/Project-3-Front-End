import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OAuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OAuth Placeholder</Text>
      <Text style={styles.subtitle}>Implement your provider flow here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555' },
});
