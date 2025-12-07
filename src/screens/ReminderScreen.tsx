import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import API from "../lib/api";

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
  const { me, refresh } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reminders from API
  const fetchReminders = async () => {
    try {
      setLoading(true);
      
      let currentMe = me;
      if (!currentMe || !currentMe.authenticated || (!currentMe.userId && !currentMe.id)) {
        if (typeof refresh === "function") {
          currentMe = await refresh();
        }
      }

      const userId = currentMe?.userId || currentMe?.id;
      if (!userId) {
        setReminders([]);
        setLoading(false);
        return;
      }

      const url = `${API.BASE}/api/reminders?userId=${userId}`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn("Failed to fetch reminders:", res.status, text);
        setReminders([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        // Map API response to UI format
        const mappedReminders = data.map((reminder: any) => ({
          id: String(reminder.id),
          title: reminder.title || "Reminder",
          dueDate: reminder.reminderDate || reminder.reminder_date,
          description: reminder.description,
          reminderType: reminder.reminderType || reminder.reminder_type,
          isCompleted: reminder.isCompleted || reminder.is_completed || false,
        }));
        
        // Sort by date (earliest first)
        mappedReminders.sort((a, b) => {
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          return dateA - dateB;
        });
        
        setReminders(mappedReminders);
      } else {
        setReminders([]);
      }
    } catch (err) {
      console.warn("Error fetching reminders:", err);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reminders on mount and when screen is focused
  useEffect(() => {
    fetchReminders();
  }, [me]);

  useFocusEffect(
    React.useCallback(() => {
      fetchReminders();
    }, [me])
  );

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

      {item.description && (
        <Text style={s.descriptionText}>{item.description}</Text>
      )}

      {item.urgent && (
        <Text style={s.reminderText}>Due within 2 weeks</Text>
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
        refreshing={loading}
        onRefresh={fetchReminders}
        ListEmptyComponent={
          <Text style={s.emptyText}>
            {loading ? "Loading reminders..." : "No reminders yet."}
          </Text>
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

  descriptionText: {
    marginTop: 4,
    fontSize: 13,
    color: PALETTE.subtext,
  },

  emptyText: {
    marginTop: 24,
    color: PALETTE.subtext,
    textAlign: "center",
  },
});
