import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedApps } from "../context/SavedAppsContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

const TUTORIAL_KEY = "tutorial:completed";

function CoachBubble({ title, body, arrowLeftPct }) {
  // Speech-bubble style with a little arrow pointing at the tab bar
  return (
    <View style={cm.wrap} pointerEvents="box-none">
      <View style={[cm.bubble, { maxWidth: "92%" }]}>
        <Text style={cm.title}>{title}</Text>
        <Text style={cm.body}>{body}</Text>
      </View>
      <View style={cm.arrowWrap}>
        <View style={[cm.arrow, { left: `${arrowLeftPct}%` }]} />
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [modelsModalVisible, setModelsModalVisible] = useState(false);
  const { savedApps, removeSavedApp } = useSavedApps();

  const topSchools = route?.params?.topSchools ?? null;
  const dataToShow = Array.isArray(topSchools) && topSchools.length > 0 ? topSchools : savedApps || [];

  // ===== Tutorial gating =====
  const [tutorialDone, setTutorialDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(route?.params?.showTutorial === true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(TUTORIAL_KEY);
        const completed = v === "1";
        setTutorialDone(completed);
        if (completed) setShowTutorial(false);
      } catch {}
    })();
  }, []);

  // Positions correspond to approximate centers for 4 tabs
  const bubbles = useMemo(
    () => [
      {
        title: "Dashboard",
        body: "Your home base for shortcuts and saved schools.",
        leftPct: 12,
      },
      {
        title: "Saved",
        body: "Quick access to the schools you’re tracking.",
        leftPct: 39,
      },
      {
        title: "Reminders",
        body: "Deadlines & financial aid reminders live here.",
        leftPct: 64,
      },
      {
        title: "Settings",
        body: "Tune your preferences to personalize results.",
        leftPct: 88,
      },
    ],
    []
  );

  const onNext = () => {
    if (step < bubbles.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Final step → push to Settings, which already has the hard gate
      setShowTutorial(false);
      navigation.navigate("Settings", { tutorialMode: true });
    }
  };

  const openUrl = (url) => url && Linking.openURL(url).catch(() => {});

  const keyForItem = useCallback(
    (item, idx) => String(item?.id ?? item?.schoolId ?? item?.name ?? idx),
    []
  );

  const renderEmpty = () => (
    <View style={s.empty}>
      <Text style={s.emptyTitle}>Your dashboard</Text>
      <Text style={s.emptySub}>
        Save colleges to see them here, set reminders, and keep everything organized.
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const name = item?.name ?? item?.schoolName ?? item?.programName ?? "Untitled";
    const program = item?.programName ?? item?.program ?? item?.programType ?? "Program info";
    const website = item?.websiteUrl ?? item?.website ?? item?.link ?? null;

    return (
      <View style={s.card}>
        <Text style={s.title}>{name}</Text>
        <Text style={s.sub}>{program}</Text>

        <View style={s.actionsRow}>
          {website ? (
            <Pressable style={s.linkBtn} onPress={() => openUrl(website)}>
              <Text style={s.linkBtnText}>Visit Website</Text>
            </Pressable>
          ) : (
            <Text style={[s.sub, { opacity: 0.7 }]}>No website</Text>
          )}

          <Pressable
            style={s.removeBtn}
            onPress={() => removeSavedApp(item?.id ?? item?.schoolId ?? item?.name)}
          >
            <Text style={s.removeBtnText}>Remove</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <View style={s.leftGroup}>
          <TouchableOpacity onPress={() => navigation.navigate("Saved Applications")}>
            <Text style={s.back}>Saved</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.h1}>Dashboard</Text>
        <TouchableOpacity onPress={() => setModelsModalVisible(true)}>
          <Text accessibilityRole="button" style={s.modelsLink}>Models</Text>
        </TouchableOpacity>
      </View>

      {Array.isArray(dataToShow) && dataToShow.length > 0 ? (
        <FlatList
          data={dataToShow}
          keyExtractor={keyForItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={renderItem}
        />
      ) : (
        renderEmpty()
      )}

      {/* ===== COACHMARKS & TRUE INPUT LOCK (Modal sits above the tab bar) ===== */}
      <Modal visible={showTutorial && !tutorialDone} transparent animationType="fade">
        <View style={s.modalOverlay}>

          {/* Bubble pointing at current tab */}
          <View style={s.bubbleContainer} pointerEvents="none">
            <CoachBubble
              title={bubbles[step].title}
              body={bubbles[step].body}
              arrowLeftPct={bubbles[step].leftPct}
            />
          </View>

          {/* Only allowed action during tutorial */}
          <View style={s.nextContainer}>
            <Pressable style={s.nextBtn} onPress={onNext}>
              <Text style={s.nextText}>
                {step < bubbles.length - 1 ? "Continue" : "Go to Settings"}
              </Text>
            </Pressable>
          </View>

        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.bg },
  header: {
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  leftGroup: { width: 80 },
  back: { color: PALETTE.navy, fontWeight: "700" },
  h1: { fontSize: 24, fontWeight: "800", color: PALETTE.text },
  modelsLink: { color: PALETTE.primary, fontWeight: "700" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: PALETTE.text },
  emptySub: { marginTop: 8, fontSize: 16, color: PALETTE.subtext, textAlign: "center" },

  card: { borderWidth: 1, borderColor: PALETTE.cardBorder, backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  title: { fontSize: 16, fontWeight: "800", color: PALETTE.text },
  sub: { color: PALETTE.subtext, marginTop: 2 },

  actionsRow: { flexDirection: "row", columnGap: 10, marginTop: 12, alignItems: "center" },
  linkBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1,
    borderColor: PALETTE.cardBorder, backgroundColor: "#ECFEFF",
  },
  linkBtnText: { color: PALETTE.navy, fontWeight: "600" },
  removeBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1,
    borderColor: PALETTE.cardBorder, backgroundColor: "#FFF5F6",
  },
  removeBtnText: { color: PALETTE.danger, fontWeight: "600" },

  // Modal overlay – blocks ALL touches including the tab bar
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  // sits above the tab bar
  bubbleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 72, // tweak if your tab bar is taller
    alignItems: "center",
  },
  nextContainer: { padding: 16, paddingBottom: 24 },
  nextBtn: {
    backgroundColor: PALETTE.primary, borderRadius: 12, paddingVertical: 14,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

// ===== Coachmark bubble styles =====
const cm = StyleSheet.create({
  wrap: { width: "100%", alignItems: "center" },
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  title: { fontSize: 16, fontWeight: "800", color: PALETTE.text, marginBottom: 4 },
  body: { fontSize: 14, color: PALETTE.subtext },
  arrowWrap: { width: "100%", height: 0, position: "relative" },
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    bottom: -10,
  },
});
