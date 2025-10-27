import * as React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GradQuest</Text>
        <Pressable style={styles.oauthButton} onPress={() => navigation.navigate('OAuth')}>
          <Text style={styles.oauthText}>OAuth Login</Text>
        </Pressable>
      </View>
      <Text style={styles.description}>Placeholder</Text>
      <Pressable style={styles.continueButton} onPress={() => navigation.navigate('Tabs')} accessibilityLabel="Continue to dashboard">
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: '700' },
  oauthButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  oauthText: { fontSize: 14, fontWeight: '600' },
  description: { marginTop: 12, fontSize: 16, color: '#444' },
  continueButton: { marginTop: 24, paddingVertical: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  continueText: { fontSize: 16, fontWeight: '600' },
});
