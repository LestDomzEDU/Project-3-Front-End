import React from "react";
import { View, Text, StyleSheet, Image, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import API from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#000000",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

type AnyObj = Record<string, unknown>;
const TUTORIAL_KEY = "tutorial:completed";

function first<T>(...args: T[]) {
  for (const a of args) if (a !== undefined && a !== null && a !== "") return a as T;
  return "" as unknown as T;
}

function pickAvatar(me?: AnyObj) {
  if (!me) return "";
  const flat = first<string>(me["avatarUrl"] as any, me["avatar_url"] as any, me["picture"] as any, me["avatar"] as any);
  if (flat) return flat;
  if (me["github"] && typeof me["github"] === "object") {
    const gh = me["github"] as AnyObj;
    return first<string>(gh["avatarUrl"] as any, gh["avatar_url"] as any);
  }
  return "";
}

function pickUsername(me?: AnyObj) {
  if (!me) return "";
  const flat = first<string>(me["login"] as any, me["username"] as any, me["githubUsername"] as any);
  if (flat) return flat;
  if (me["github"] && typeof me["github"] === "object" && typeof (me["github"] as AnyObj)["login"] === "string") {
    return (me["github"] as AnyObj)["login"] as string;
  }
  return first<string>(me["email"] as any, "Unknown User");
}

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [me, setMe] = React.useState<AnyObj | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [tutorialGate, setTutorialGate] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      setMe(data);
    } catch {
      setMe(null);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      load();
      return;
    }, [load])
  );

  const route = useRoute() as any;
  const fromTutorial = !!(route?.params && (route.params as any).tutorialMode);

  React.useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(TUTORIAL_KEY);
      const done = v === "1";
      // Show gate if we were sent from tutorial AND not already complete
      setTutorialGate(fromTutorial && !done);
    })();
  }, [fromTutorial]);

  const onLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(API.LOGOUT, { method: "POST", credentials: "include" });
    } catch {
    } finally {
      setBusy(false);
      (navigation as any).reset({
        index: 0,
        routes: [{ name: "Home" as never }],
      } as any);
    }
  };

  const onAdjustPreferences = async () => {
    // Mark tutorial complete *as soon as* user chooses to adjust preferences
    try { await AsyncStorage.setItem(TUTORIAL_KEY, "1"); } catch {}
    setTutorialGate(false);
    (navigation as any).navigate("ProfileIntake" as never);
  };

  const avatarSrc =
    pickAvatar(me || {}) ||
    "https://ui-avatars.com/api/?name=U&background=EEE&color=7C7C7C";
  const username = pickUsername(me || {}) || "Unknown User";

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Settings</Text>
      </View>

      <View style={s.card}>
        <View style={s.profileRow}>
          <Image source={{ uri: avatarSrc }} style={s.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={s.username}>{username}</Text>
            <Text style={s.subtext}>Signed in</Text>
          </View>
        </View>

        <Pressable style={s.primaryButton} onPress={onAdjustPreferences}>
          <Text style={s.primaryButtonText}>Adjust Preferences</Text>
        </Pressable>

        <Pressable style={s.logoutButton} onPress={onLogout} disabled={busy}>
          <Text style={s.logoutText}>{busy ? "Logging out..." : "Log out"}</Text>
        </Pressable>
      </View>

      {/* Hard gate overlay: only action is Adjust Preferences */}
      <Modal visible={tutorialGate} transparent animationType="fade">
        <View style={s.gateOverlay}>
          <View style={s.gateCard}>
            <Text style={s.gateTitle}>Finish setup</Text>
            <Text style={s.gateBody}>
              To unlock the app, press <Text style={{fontWeight:"800"}}>Adjust Preferences</Text> and configure your interests.
            </Text>
            <Pressable style={s.primaryButton} onPress={onAdjustPreferences}>
              <Text style={s.primaryButtonText}>Adjust Preferences</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg, paddingHorizontal: 16, paddingVertical: 12 },
  header: { marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: PALETTE.text },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    padding: 16,
  },

  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#eee", marginRight: 12 },

  username: { fontSize: 20, fontWeight: "800", color: PALETTE.text },
  subtext: { marginTop: 2, color: PALETTE.subtext },

  primaryButton: {
    marginTop: 16,
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  logoutButton: {
    marginTop: 10,
    backgroundColor: "#FFF5F5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: { color: PALETTE.danger, fontWeight: "700", fontSize: 16 },

  // Gate overlay styles
  gateOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  gateCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  gateTitle: { fontSize: 20, fontWeight: "800", color: PALETTE.text, marginBottom: 8 },
  gateBody: { color: PALETTE.subtext, marginBottom: 16 },
});
