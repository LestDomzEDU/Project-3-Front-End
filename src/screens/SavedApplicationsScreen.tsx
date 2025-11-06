import * as React from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Linking, } from "react-native";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

export default function SavedApplicationsScreen() {
  const savedApps = [
    {
      id: "1",
      name: "AI Research Fellowship",
      company: "OpenAI Scholars",
      urgent: true,
      link: "https://example.com/app1",
    },
    {
      id: "2",
      name: "Graduate Data Science Internship",
      company: "DataQuest Labs",
      urgent: false,
      link: "https://example.com/app2",
    },
    {
      id: "3",
      name: "PhD Program in ML",
      company: "TechU",
      urgent: true,
      link: "https://example.com/app3",
    },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.appCard}>
      {/* Left urgent mark */}
      <View style={styles.leftIcon}>
        {item.urgent && <Text style={styles.urgentMark}>❗</Text>}
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appName}>{item.name}</Text>
        <Text style={styles.appCompany}>{item.company}</Text>
      </View>

      {/* Apply button */}
      <Pressable
        style={({ pressed }) => [styles.applyButton, pressed && { opacity: 0.9 }]}
        onPress={() => Linking.openURL(item.link)}
      >
        <Text style={styles.applyText}>Apply</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Apps</Text>

      <FlatList
        data={savedApps}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved applications yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: PALETTE.text,
  },
  listContainer: {
    paddingBottom: 60,
  },
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  leftIcon: {
    width: 30,
    alignItems: "center",
  },
  urgentMark: {
    fontSize: 20,
    color: PALETTE.danger, 
  },
  appInfo: {
    flex: 1,
    marginHorizontal: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: "700",
    color: PALETTE.text,
  },
  appCompany: {
    fontSize: 14,
    color: PALETTE.subtext,
    marginTop: 2,
  },
  applyButton: {
    backgroundColor: PALETTE.primary, 
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  applyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: PALETTE.subtext,
  },
});