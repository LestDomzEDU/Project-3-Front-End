import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// 🎨 Define a simple color palette for consistency
const PALETTE = {
  bg: "#FFFFFF",
};

export default function LoadingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Tabs" as never); // "Tabs" goes to your Dashboard tab
    }, 2000);

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