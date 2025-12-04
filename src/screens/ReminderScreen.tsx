import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PALETTE = {
  blueDark: "#053F7C",
  blue: "#0061A8",
  gold: "#FFC727",
  white: "#FFFFFF",
  textDark: "#001B33",
  subtext: "#4B5563",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

export default function ReminderScreen() {
  const [reminders] = useState([
    {
      id: "1",
      title: "Application Deadline",
      dueDate: "2025-11-20",
    },
    {
      id: "2",
      title: "COR (Letter of Recommendation) Due",
      dueDate: "2025-11-18",
    },
    {
      id: "3",
      title: "Personal Statement Due",
      dueDate: "2025-12-05",
    },
    {
      id: "4",
      title: "Schedule GRE (if needed)",
      dueDate: "2025-11-10",
    },
  ]);

  // Compute urgency (within 14 days)
  const today = new Date();
  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

  const processedReminders = reminders.map((item) => {
    const due = new Date(item.dueDate);
    const diff = due.getTime() - today.getTime();
    return { ...item, urgent: diff <= TWO_WEEKS_MS && diff > 0 };
  });

  const renderItem = ({ item }: any) => (
    <View style={s.card}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={s.cardTitle}>{item.title}</Text>
        {item.urgent && <Text style={s.urgent}> ❗</Text>}
      </View>

      <Text style={s.dateText}>
        Due: {new Date(item.dueDate).toLocaleDateString()}
      </Text>

      {item.urgent && (
        <Text style={s.reminderText}>Reminder sent 2 weeks before deadline</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ width: 40 }} />

        <Text style={s.headerTitle}>Reminders</Text>

        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={s.logo}
        />
      </View>

      {/* Yellow divider bar */}
      <View style={s.headerAccent} />

      <FlatList
        data={processedReminders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.listContainer}
        ListEmptyComponent={
          <Text style={s.emptyText}>No reminders yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.white,
  },

  /* ⇢ Header */
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
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: PALETTE.blueDark,
  },

  listContainer: {
    padding: 16,
    paddingBottom: 60,
  },

  /* ⇢ Reminder Cards */
  card: {
    backgroundColor: PALETTE.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PALETTE.textDark,
  },
  dateText: {
    color: PALETTE.subtext,
    fontSize: 14,
    marginTop: 4,
  },

  urgent: {
    color: PALETTE.danger,
    fontSize: 18,
    fontWeight: "800",
  },

  reminderText: {
    marginTop: 6,
    fontSize: 13,
    color: PALETTE.blue,
    fontStyle: "italic",
  },

  emptyText: {
    marginTop: 24,
    color: PALETTE.subtext,
    textAlign: "center",
  },
});
