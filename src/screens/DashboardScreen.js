import React, { useCallback, useState } from "react";
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

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

export default function DashboardScreen({ navigation, route }) {
  const [modelsModalVisible, setModelsModalVisible] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const { savedApps, addSavedApp, removeSavedApp } = useSavedApps();

  // read results passed in when ProfileIntake navigates:
  const topSchools = route?.params?.topSchools ?? null;

  const defaultColleges = [
    {
      id: "c1",
      name: "Georgia Tech",
      programName: "MS Computer Science",
      urgent: true,
      websiteUrl: "https://www.gatech.edu/",
    },
    {
      id: "c2",
      name: "San Jose State University",
      programName: "MS Data Science",
      urgent: false,
      websiteUrl: "https://www.sjsu.edu/",
    },
    {
      id: "c3",
      name: "Harvard University",
      programName: "PhD ML",
      urgent: true,
      websiteUrl: "https://www.harvard.edu/",
    },
  ];

  // Use your exact logic:
  const dataToShow =
    Array.isArray(topSchools) && topSchools.length > 0
      ? topSchools
      : defaultColleges;

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
                <Text style={s.linkBtnText}>View Website</Text>
              </Pressable>
            ) : (
              <Text style={[s.sub, { opacity: 0.7 }]}>No website</Text>
            )}

            <TouchableOpacity
              onPress={() => {
                if (saved) removeSavedApp(id);
                else
                  addSavedApp({
                    id,
                    name,
                    company: program,
                    urgent: !!item.urgent,
                    link: website,
                  });
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
        <TouchableOpacity
          onPress={() =>
            navigation && navigation.navigate?.("Saved Applications")
          }
        >
          <Text style={s.back}>Saved</Text>
        </TouchableOpacity>

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
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: PALETTE.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { color: PALETTE.primary, fontWeight: "700" },
  h1: { fontSize: 18, fontWeight: "800", color: PALETTE.text },

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
  title: { fontSize: 16, fontWeight: "700", color: PALETTE.text },
  sub: { marginTop: 2, color: PALETTE.subtext },

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
  linkBtnText: { color: "#fff", fontWeight: "700" },

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
  removeBtnText: { color: PALETTE.danger, fontWeight: "600" },

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
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  modelItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  modelText: { fontSize: 16 },
  closeButton: {
    marginTop: 12,
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});
