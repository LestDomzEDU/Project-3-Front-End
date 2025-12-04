import React, { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// 🎨 Simple color palette
const PALETTE = {
  bg: "#FFFFFF",
};

export default function LoadingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // After 5 seconds, send the user to the Home screen
      navigation.navigate("Home" as never);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Your logo or splash image */}
      <Image
        source={require("../../assets/gradquest_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200, // adjust for your design
    height: 200,
  },
});
