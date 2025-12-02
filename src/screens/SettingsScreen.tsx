import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

type AnyObj = Record<string, any>;

function first<T = string>(...vals: Array<T | undefined | null>) {
  for (const v of vals) if (v !== undefined && v !== null && String(v).length) return v as T;
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
  const { me, setMe } = useAuth();
  const navigation = useNavigation();
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch(API.ME, { credentials: "include" });
      const data = await res.json();
      setMe(data || null);
    } catch {
      setMe(null);
    }
  }, [setMe]);

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
    <SafeAreaView style={s.screen}>
      {/* Header matching other screens */}
      <View style={s.header}>
        <View style={{ width: 40 }} />
        <Text style={s.headerTitle}>Settings</Text>
        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={s.logo}
        />
      </View>

      <View style={s.headerAccent} />

      {/* Content */}
      <View style={s.content}>
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
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.white,
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

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    backgroundColor: PALETTE.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eee",
    marginRight: 12,
  },

  username: { fontSize: 20, fontWeight: "800", color: PALETTE.textDark },
  subtext: { marginTop: 2, color: PALETTE.subtext },

  primaryButton: {
    marginTop: 16,
    backgroundColor: PALETTE.blue,
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
