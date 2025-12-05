// display the generate SOP screen
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import API from "../lib/api";

const PALETTE = {
  blueDark: "#053F7C",
  blue: "#0061A8",
  gold: "#FFC727",
  white: "#FFFFFF",
  textDark: "#001B33",
  subtext: "#4B5563",
};

export default function GenerateSOPScreen() {
  const [sopText, setSopText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const pickResume = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to pick file");
    }
  }, []);

  const handleGenerateSOP = useCallback(async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a resume PDF first");
      return;
    }

    setLoading(true);

    try {
      // Build FormData with resume file and query params
      const formData = new FormData();
      formData.append("resume", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: "application/pdf",
      } as any);

      const url = new URL(`${API.BASE}/api/sop/generate`);
      url.searchParams.append(
        "targetProgram",
        route.params?.targetProgram ?? "MS in Computer Science"
      );
      url.searchParams.append(
        "targetUniversity",
        route.params?.targetUniversity ?? "Example University"
      );
      url.searchParams.append("extraNotes", route.params?.extraNotes ?? "");

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      const payload = isJson
        ? await response.json().catch(() => ({}))
        : { raw: await response.text() };

      if (response.ok && payload?.sopDraft) {
        setSopText(payload.sopDraft);
      } else {
        const message =
          (isJson ? payload?.error : undefined) ||
          (payload?.raw ? payload.raw.slice(0, 500) : "Failed to generate SOP");
        Alert.alert("Error", message);
      }
    } catch (error) {
      Alert.alert("Error", `An unexpected error occurred: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [route.params, selectedFile]);

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Generate Statement of Purpose</Text>

        <Pressable style={s.pickBtn} onPress={pickResume}>
          <Text style={s.pickBtnText}>
            {selectedFile ? `📄 ${selectedFile.name}` : "Pick Resume (PDF)"}
          </Text>
        </Pressable>

        <Pressable
          style={[s.generateBtn, !selectedFile && s.generateBtnDisabled]}
          onPress={handleGenerateSOP}
          disabled={loading || !selectedFile}
        >
          {loading ? (
            <ActivityIndicator color={PALETTE.white} />
          ) : (
            <Text style={s.generateBtnText}>Generate SOP</Text>
          )}
        </Pressable>

        {sopText ? (
          <View style={s.sopContainer}>
            <Text style={s.sopTitle}>Generated SOP:</Text>
            <Text style={s.sopText}>{sopText}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.white,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PALETTE.textDark,
    marginBottom: 16,
  },
  pickBtn: {
    backgroundColor: PALETTE.blueDark,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  pickBtnText: {
    color: PALETTE.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  generateBtn: {
    backgroundColor: PALETTE.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  generateBtnDisabled: {
    opacity: 0.5,
  },
  generateBtnText: {
    color: PALETTE.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  sopContainer: {
    marginTop: 16,
  },
  sopTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PALETTE.textDark,
    marginBottom: 8,
  },
  sopText: {
    fontSize: 16,
    color: PALETTE.subtext,
    lineHeight: 22,
  },
});
