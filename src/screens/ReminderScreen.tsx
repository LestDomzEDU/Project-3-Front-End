import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

export default function ReminderScreen() {
  // Example mock data
  const [reminders, setReminders] = useState([
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
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>{item.title}</Text>
        {item.urgent && <Text style={styles.urgent}> ❗</Text>}
      </View>
      <Text style={styles.date}>
        Due: {new Date(item.dueDate).toLocaleDateString()}
      </Text>
      {item.urgent && (
        <Text style={styles.reminderText}>
          Reminder sent 2 weeks before deadline
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Reminders</Text>

      <FlatList
        data={processedReminders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reminders yet.</Text>
        }
      />
    </SafeAreaView>
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
        paddingBottom: 40,
    },
    card: {
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
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: PALETTE.text,
    },
    date: {
        fontSize: 14,
        color: PALETTE.subtext,
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
        color: PALETTE.primary,
        fontStyle: "italic",
    },
    emptyText: {
        textAlign: "center",
        color: PALETTE.subtext,
        marginTop: 24,
    },
});