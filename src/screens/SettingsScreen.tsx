import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => console.log("User logged out") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile */}
      <View style={styles.profileHeader}>
        <Image source={require("../../assets/user_icon.png")} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>johndoe@email.com</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>

      {/* Preferences "button" */}
      <Pressable
        style={({ pressed }) => [styles.prefRowButton, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel="Open preferences and see top schools"
        onPress={() => navigation.navigate("Preferences" as never)}
      >
        <View>
          <Text style={styles.settingLabel}>Find Top Schools by Preferences</Text>
          <Text style={styles.settingSub}>Tap to select preferences and view recommendations</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 
    PALETTE.bg, 
    paddingHorizontal: 16, 
    paddingTop: 40 
  },
  profileHeader: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 18,
    borderBottomWidth: 1, 
    borderBottomColor: PALETTE.cardBorder, 
    paddingBottom: 18,
  },
  avatar: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 16 
  },
  userName: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: PALETTE.text 
  },
  userEmail: { 
    fontSize: 14, 
    color: PALETTE.subtext, 
    marginTop: 4 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: PALETTE.navy, 
    marginTop: 10, 
    marginBottom: 8 
  },
  prefRowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F7FDFF",
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: PALETTE.cardBorder,
  },
  settingLabel: { 
    fontSize: 15, 
    color: PALETTE.text, 
    fontWeight: "600" 
  },
  settingSub: { 
    fontSize: 12, 
    color: PALETTE.subtext, 
    marginTop: 3 
  },
  chevron: { 
    fontSize: 26, 
    color: PALETTE.navy, 
    marginLeft: 10 
  },
  logoutButton: {
    marginTop: "auto", 
    backgroundColor: "#FFF5F5", 
    paddingVertical: 14, 
    borderRadius: 10,
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#FECACA",
  },
  logoutText: { 
    color: PALETTE.danger, 
    fontWeight: "700", 
    fontSize: 16 
  },
});