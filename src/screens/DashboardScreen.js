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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedApps } from "../context/SavedAppsContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const PALETTE = {
  blueDark: "#053F7C",
  blue: "#0061A8",
  gold: "#FFC727",
  white: "#FFFFFF",
  textDark: "#001B33",
  subtext: "#4B5563",
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [modelsModalVisible, setModelsModalVisible] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const { savedApps, addSavedApp, removeSavedApp } = useSavedApps();

  // Data passed from other screens (Preferences or Intake)
  const topSchools = route?.params?.topSchools ?? [];
  const dataToShow = Array.isArray(topSchools) ? topSchools : [];

  const openUrl = (url) => url && Linking.openURL(url).catch(() => {});

  const keyForCollege = useCallback(
    (item) => String(item.id ?? item.schoolId ?? item.name),
    []
  );

  const renderItem = ({ item }) => {
    const id = item.id ?? item.schoolId ?? item.name;
    const saved = savedApps.find((a) => a.id === id);

    const name = item.name ?? item.schoolName ?? item.programName ?? "Untitled";
    const program =
      item.programName ?? item.program ?? item.programType ?? "Program info";
    const website = item.websiteUrl ?? item.website ?? item.link ?? null;
    console.log(website);

    return (
      <View style={s.card}>
        <Text style={s.cardTitle}>{name}</Text>
        <Text style={s.cardSub}>{program}</Text>

        <View style={s.cardActions}>
          {website ? (
            <Pressable onPress={() => openUrl(website)} style={s.primaryBtn}>
              <Text style={s.primaryBtnText}>Visit</Text>
            </Pressable>
          ) : (
            <Text style={[s.cardSub, { opacity: 0.7 }]}>No website</Text>
          )}

          <TouchableOpacity
            onPress={() =>
              saved
                ? removeSavedApp(id)
                : addSavedApp({
                    id,
                    name,
                    company: program,
                    urgent: !!item.urgent,
                    link: website,
                  })
            }
            style={saved ? s.removeBtn : s.saveBtn}
          >
            <Text style={saved ? s.removeBtnText : s.saveBtnText}>
              {saved ? "Remove" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* HEADER */}
      <View style={s.header}>
        {/* Left spacer keeps Dashboard centered */}
        <View style={{ width: 40 }} />

        <Text style={s.headerTitle}>Dashboard</Text>

        {/* Logo on the RIGHT */}
        <Image
          source={require("../../assets/gradquest_logo.png")}
          style={s.logo}
        />
      </View>

      {/* Yellow accent */}
      <View style={s.headerAccent} />

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={dataToShow}
        keyExtractor={keyForCollege}
        ListEmptyComponent={
          <Text style={[s.cardSub, { textAlign: "center", marginTop: 24 }]}>
            No matches yet.
          </Text>
        }
        renderItem={renderItem}
      />

      {/* Models Modal */}
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
              data={[]}
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
  screen: { flex: 1, backgroundColor: PALETTE.white },

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

  card: {
    backgroundColor: PALETTE.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE8F2",
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
  cardSub: {
    color: PALETTE.subtext,
    marginTop: 3,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    gap: 10,
  },

  primaryBtn: {
    backgroundColor: PALETTE.blue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: PALETTE.white,
    fontWeight: "700",
  },

  saveBtn: {
    backgroundColor: "#E6F8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: {
    color: PALETTE.blueDark,
    fontWeight: "700",
  },
  removeBtn: {
    backgroundColor: "#FFF5F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  removeBtnText: {
    color: "#B00020",
    fontWeight: "700",
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
    backgroundColor: PALETTE.white,
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
    color: PALETTE.white,
    fontWeight: "600",
  },
});
