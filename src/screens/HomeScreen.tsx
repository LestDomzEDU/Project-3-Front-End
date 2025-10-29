import * as React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>GradQuest</Text>

        <Pressable
          onPress={() => navigation.navigate('OAuth' as never)}
          style={({ pressed }) => [styles.oauthButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Sign in with OAuth"
          hitSlop={8}
        >
          <Text style={styles.oauthText}>OAuth Login</Text>
        </Pressable>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.description}>
          Track your grad school tasks, deadlines, and progress in one place. Stay organized and on top of your applications with ease.
        </Text>
      </View>

      <Pressable
          onPress={() => navigation.navigate('Tabs' as never)}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Continue to dashboard"
          hitSlop={6}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
    color: '#101010',
  },
  oauthButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FAFAFA',
  },
  oauthText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5f5f5f',
  },
  pressed: {
    opacity: 0.75,
  },
  contentCard: {
    marginTop: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 18,
    backgroundColor: '#FFF',
  },
  description: {
    fontSize: 17,
    lineHeight: 22,
    color: '#797d7e',
    marginBottom: 16,
    marginTop: 4,
  },
  primaryBtn: {
    marginTop: 100,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  primaryBtnPressed: {
    opacity: 0.9,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
