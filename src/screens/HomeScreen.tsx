import * as React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const goToOAuth = () => navigation.navigate('OAuth' as never);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>GradQuest</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.description}>
          Track your grad school tasks, deadlines, and progress in one place. Stay organized and on top of your applications with ease.
        </Text>
      </View>

      {/* Mandatory sign-in entry point */}
      <Pressable
        onPress={goToOAuth}
        style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
        accessibilityRole="button"
        accessibilityLabel="Sign In and Continue"
        hitSlop={6}
      >
        <Text style={styles.primaryBtnText}>Sign In and Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginTop: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00171F',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCE8F2',
    padding: 16,
    marginTop: 12,
  },
  description: {
    fontSize: 14,
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
