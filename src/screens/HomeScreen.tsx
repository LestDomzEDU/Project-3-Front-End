// import * as React from 'react';
// import { View, Text, Pressable, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// export default function HomeScreen() {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>GradQuest</Text>
//         <Pressable style={styles.oauthButton} onPress={() => navigation.navigate('OAuth')}>
//           <Text style={styles.oauthText}>OAuth Login</Text>
//         </Pressable>
//       </View>
//       <Text style={styles.description}>Placeholder</Text>
//       <Pressable style={styles.continueButton} onPress={() => navigation.navigate('Tabs')} accessibilityLabel="Continue to dashboard">
//         <Text style={styles.continueText}>Continue</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingHorizontal: 20, paddingTop: 60, backgroundColor: '#fff' },
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   title: { fontSize: 28, fontWeight: '700' },
//   oauthButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
//   oauthText: { fontSize: 14, fontWeight: '600' },
//   description: { marginTop: 12, fontSize: 16, color: '#444' },
//   continueButton: { marginTop: 24, paddingVertical: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
//   continueText: { fontSize: 16, fontWeight: '600' },
// });

import * as React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, StatusBar, Platform } from 'react-native';
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: '#797d7e',
    marginBottom: 8,
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
