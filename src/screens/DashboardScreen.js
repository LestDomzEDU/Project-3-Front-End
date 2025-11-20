import { useState, useCallback } from "react";
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

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // ✅ provide route so params work
  const [modelsModalVisible, setModelsModalVisible] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const { savedApps, addSavedApp, removeSavedApp } = useSavedApps();

  // read results passed in when ProfileIntake navigates:
  const topSchools = route?.params?.topSchools ?? null;

  const dataToShow =
    Array.isArray(topSchools) && topSchools.length > 0 ? topSchools : [];

  const openUrl = (url) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  const keyForCollege = useCallback(
    (item) => String(item.id ?? item.schoolId ?? item.name),
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
      const id = item.id ?? item.schoolId ?? item.name;
      const saved = savedApps.find((a) => a.id === id);

      const name =
        item.name ?? item.schoolName ?? item.programName ?? "Untitled";
      const program =
        item.programName ?? item.program ?? item.programType ?? "Program info";
      const website = item.websiteUrl ?? item.website ?? item.link ?? null;

      return (
        <View style={s.card}>
          <Text style={s.title}>{name}</Text>
          <Text style={s.sub}>{program}</Text>

          <View style={s.actionsRow}>
            {website ? (
              <Pressable onPress={() => openUrl(website)} style={s.linkBtn}>
                <Text style={s.linkBtnText}>Visit Website</Text>
              </Pressable>
            ) : (
              <Text style={[s.sub, { opacity: 0.7 }]}>No website</Text>
            )}

            <TouchableOpacity
              onPress={() => {
                if (saved) {
                  // ✅ use the same id we keyed by
                  removeSavedApp(id);
                } else {
                  addSavedApp({
                    id,
                    name,
                    company: program,
                    urgent: !!item.urgent,
                    link: website,
                  });
                }
              }}
              style={saved ? s.removeBtn : s.saveBtn}
            >
              <Text style={saved ? s.removeBtnText : s.saveBtnText}>
                {saved ? "Remove" : "Save"}
              </Text>
            </TouchableOpacity>

            <Pressable
              style={[s.modelTrigger, { marginLeft: 8 }]}
              onPress={() => {
                setSelectedCollege(item);
                setModelsModalVisible(true);
              }}
            >
              <Text
                style={
                  s.modelTriggerText ?? { color: "#007AFF", fontWeight: "700" }
                }
              >
                Show Models
              </Text>
            </Pressable>
          </View>
        </View>
      );
    },
    [savedApps, addSavedApp, removeSavedApp]
  );

  const models = []; // leave for now; wire to model data if you add it later

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <View style={s.leftGroup}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Saved Applications")}
          >
            <Text style={s.back}>Saved</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.h1}>Dashboard</Text>
        <TouchableOpacity onPress={() => setModelsModalVisible(true)}>
          <Text style={s.back}>Models</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={dataToShow}
        keyExtractor={keyForCollege}
        ListEmptyComponent={
          <Text style={[s.sub, { textAlign: "center", marginTop: 24 }]}>
            No matches yet.
          </Text>
        }
        renderItem={renderItem}
      />

      <Modal
        visible={modelsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModelsModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Models</Text>
            <Text style={{ marginBottom: 8, color: "#374151" }}>
              {selectedCollege
                ? `${
                    selectedCollege.name ?? selectedCollege.schoolName ?? ""
                  } — ${
                    selectedCollege.programName ?? selectedCollege.program ?? ""
                  }`
                : ""}
            </Text>
            <FlatList
              data={models}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <Pressable
                  style={s.modelItem}
                  onPress={() => setModelsModalVisible(false)}
                >
                  <Text style={s.modelText}>{item}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={s.closeButton}
              onPress={() => setModelsModalVisible(false)}
            >
              <Text style={s.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={s.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={s.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: PALETTE.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backArrow: {
    color: PALETTE.primary,
    fontWeight: "700",
    fontSize: 16,
    marginRight: 4,
  },
  back: {
    color: PALETTE.primary,
    fontWeight: "700",
  },
  h1: {
    fontSize: 18,
    fontWeight: "800",
    color: PALETTE.text,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 40,
    backgroundColor: PALETTE.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "left",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
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
  sub: {
    marginTop: 2,
    color: PALETTE.subtext,
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  linkBtn: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  saveBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    backgroundColor: "#E6F8FF",
  },
  saveBtnText: { color: PALETTE.navy, fontWeight: "700" },
  removeBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    backgroundColor: "#FFF5F6",
  },
  removeBtnText: {
    color: PALETTE.danger,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  modelItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  modelText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});