import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import API from "../lib/api";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#000000",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

type AnyObj = Record<string, any>;

function first<T = string>(...vals: Array<T | undefined | null>) {
  for (const v of vals)
    if (v !== undefined && v !== null && String(v).length) return v as T;
  return "" as unknown as T;
}

function pickAvatar(me?: AnyObj) {
  if (!me) return "";
  const flat = first(me.avatarUrl, me.avatar_url, me.picture, me.avatar);
  if (flat) return flat as string;
  if (me.github && typeof me.github === "object") {
    return first(me.github.avatarUrl, me.github.avatar_url) as string;
  }
  return "";
}

function pickUsername(me?: AnyObj) {
  if (!me) return "";
  const flat = first(me.login, me.username, me.githubUsername);
  if (flat) return flat as string;
  if (me.github && typeof me.github === "object") {
    return first(me.github.login, me.github.username) as string;
  }
  return "";
}

export default function SettingsScreen() {
  // ✅ Use the Auth context as the single source of truth
  const { me, setMe, refresh } = useAuth();
  const navigation = useNavigation();
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      setMe(data);
    } catch {
      setMe(null);
    }
  }, [setMe]);

  // Refresh whenever the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      load();
      return;
    }, [load])
  );

  const onLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(API.LOGOUT, { method: "POST", credentials: "include" });
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
    (navigation as any).reset({
      index: 0,
      routes: [{ name: "Home" as never }],
    } as any);
  };

  const onAdjustPreferences = () => {
    (navigation as any).navigate("ProfileIntake" as never);
  };

  const avatarSrc =
    pickAvatar(me) ||
    "https://ui-avatars.com/api/?name=U&background=EEE&color=7C7C7C";
  const username = pickUsername(me) || "Unknown User";

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Settings</Text>
      </View>

      <View style={s.card}>
        <View style={s.profileRow}>
          <Image source={{ uri: avatarSrc }} style={s.avatar} />
          <View>
            <Text style={s.username}>@{username}</Text>
            <Text style={s.subtext}>Signed in</Text>
          </View>
        </View>

        <Pressable style={s.primaryButton} onPress={onAdjustPreferences}>
          <Text style={s.primaryButtonText}>Adjust Preferences</Text>
        </Pressable>

        <Pressable style={s.logoutButton} onPress={onLogout} disabled={busy}>
          <Text style={s.logoutText}>
            {busy ? "Logging out..." : "Log out"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: { marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: PALETTE.text },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    padding: 16,
    marginTop: 12,
  },

  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eee",
    marginRight: 12,
  },

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
});
