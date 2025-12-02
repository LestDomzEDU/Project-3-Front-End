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

const PALETTE = {
  blueDark: "#053F7C",
  blue: "#0061A8",
  gold: "#FFC727",
  white: "#FFFFFF",
  textDark: "#001B33",
  subtext : "#4B5563",
};

export default function SavedApplicationsScreen() {
  const apps = [
    {
      id: "1",
      name: "AI Research Fellowship",
      company: "OpenAI Scholars",
      urgent: true,
      link: "https://example.com",
    },
    {
      id: "2",
      name: "Graduate Data Science Internship",
      company: "DataQuest Labs",
      urgent: false,
      link: "https://example.com",
    },
    {
      id: "3",
      name: "PhD Program in ML",
      company: "TechU",
      urgent: true,
      link: "https://example.com",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={s.card}>
      {item.urgent && <Text style={s.urgent}>❗</Text>}

      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{item.name}</Text>
        <Text style={s.cardSub}>{item.company}</Text>
      </View>

      <Pressable style={s.applyBtn} onPress={() => Linking.openURL(item.link)}>
        <Text style={s.applyBtnText}>Apply</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <View style={{ width: 40 }} />
        <Text style={s.headerTitle}>Saved Apps</Text>
        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={s.logo}
        />
      </View>

      <View style={s.headerAccent} />

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
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
});