import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PALETTE = {
  blueDark: "#053F7C",
  blue: "#0061A8",
  gold: "#FFC727",
  white: "#FFFFFF",
  textDark: "#00171F",
  subtext: "#4B5563",
};

export default function HomeScreen() {
  const navigation = useNavigation();

  const goToOAuth = () => navigation.navigate("OAuth" as never);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.title}>GradQuest</Text>

        {/* Right-aligned logo */}
        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={styles.logo}
        />
      </View>

      {/* Yellow divider */}
      <View style={styles.headerAccent} />

      {/* Intro card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Track your grad school tasks, deadlines, and progress in one place.
          Stay organized and confidently manage all your applications with ease.
        </Text>
      </View>

      {/* Sign in */}
      <Pressable
        onPress={goToOAuth}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={styles.primaryButtonText}>Sign In and Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  /* Header with right logo */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  headerAccent: {
    height: 4,
    backgroundColor: PALETTE.gold,
    width: "100%",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: PALETTE.blueDark,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  /* Info/hero card */
  infoCard: {
    backgroundColor: PALETTE.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE8F2",
    padding: 18,
    marginTop: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: PALETTE.subtext,
  },

  /* Main CTA Button */
  primaryButton: {
    marginTop: 60,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.blue,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: PALETTE.white,
  },
});