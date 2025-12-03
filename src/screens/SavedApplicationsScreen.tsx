import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Linking,
  Image,
} from "react-native";
import { useSavedApps } from "../context/SavedAppsContext";

const PALETTE = {
  blueDark: "#053F7C",
  blue: "#0061A8",
  gold: "#FFC727",
  white: "#FFFFFF",
  textDark: "#001B33",
  subtext : "#4B5563",
};

export default function SavedApplicationsScreen() {
  const { savedApps, removeSavedApp } = useSavedApps();

  const renderItem = ({ item }) => (
    <View style={s.card}>
      {/* {item.urgent && <Text style={s.urgent}>❗</Text>} */}

      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{item.name}</Text>
        <Text style={s.cardSub}>{item.company}</Text>
      </View>

      {/* Visit Button */}
      {item.link ? (
        <Pressable style={s.visitBtn} onPress={() => Linking.openURL(item.link)}>
          <Text style={s.visitBtnText}>Visit</Text>
        </Pressable>
      ) : null}

      {/* Remove Button */}
      <Pressable
        style={s.removeBtn}
        onPress={() => removeSavedApp(item.id)}
      >
        <Text style={s.removeBtnText}>Remove</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={s.screen}>
      {/* HEADER */}
      <View style={s.header}>
        <View style={{ width: 40 }} />
        <Text style={s.headerTitle}>Saved Apps</Text>
        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={s.logo}
        />
      </View>
      <View style={s.headerAccent} />
      
      {savedApps.length === 0 ? (
        <View style={s.emptyContainer}>
          <Text style={s.emptyTitle}>No Saved Applications</Text>
          <Text style={s.emptySubtitle}>Tap “Save” on any college to track it here.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={savedApps}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: 
    PALETTE.white 
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: PALETTE.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAccent: {
    height: 4,
    backgroundColor: PALETTE.gold,
    width: "100%",
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: PALETTE.blueDark,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: PALETTE.textDark,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: PALETTE.subtext,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: PALETTE.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE8F2",
    marginBottom: 14,
  },
  urgent: {
    fontSize: 20,
    color: "red",
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PALETTE.textDark,
  },
  cardSub: {
    color: PALETTE.subtext,
    marginTop: 3,
  },
  applyBtn: {
    backgroundColor: PALETTE.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyBtnText: {
    color: PALETTE.white,
    fontWeight: "700",
  },
  visitBtn: {
    backgroundColor: PALETTE.blue,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  visitBtnText: {
    color: PALETTE.white,
    fontWeight: "700",
  },
  removeBtn: {
    backgroundColor: "#FFE8E8",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  removeBtnText: {
    // color: PALETTE.danger,
    fontWeight: "700",
  },
});