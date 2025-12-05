import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import API from "../lib/api";

// Update this with your backend URL
export default function UploadResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [targetProgram, setTargetProgram] = useState("");
  const [targetUniversity, setTargetUniversity] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [sopDraft, setSopDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setResumeFile(file);
        setError("");
        Alert.alert("Success", `Selected: ${file.name}`);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const generateSOP = async () => {
    // Validation
    if (!resumeFile) {
      setError("Please upload a resume PDF");
      return;
    }
    if (!targetProgram.trim()) {
      setError("Please enter target program");
      return;
    }
    if (!targetUniversity.trim()) {
      setError("Please enter target university");
      return;
    }

    setLoading(true);
    setError("");
    setSopDraft("");

    try {
      // Create FormData
      const formData = new FormData();

      // Add the PDF file (React Native FormData format)
      const fileUri = resumeFile.uri;
      const fileName = resumeFile.name;
      const fileType = resumeFile.mimeType || "application/pdf";

      // @ts-ignore - React Native FormData accepts this format
      formData.append("resume", {
        uri: fileUri,
        name: fileName,
        type: fileType,
      } as any);

      formData.append("targetProgram", targetProgram);
      formData.append("targetUniversity", targetUniversity);
      formData.append("extraNotes", extraNotes);

      // Make API call
      const response = await axios.post(
        `${API.BASE}/api/sop/generate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // 60 second timeout
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSopDraft(response.data.sopDraft);
      }
    } catch (err) {
      console.error("Error generating SOP:", err);
      if (err.response) {
        setError(err.response.data?.error || "Server error occurred");
      } else if (err.request) {
        setError(
          "Network error. Please check your connection and backend URL."
        );
      } else {
        setError("Failed to generate SOP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setResumeFile(null);
    setTargetProgram("");
    setTargetUniversity("");
    setExtraNotes("");
    setSopDraft("");
    setError("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>SOP Generator</Text>
        <Text style={styles.subtitle}>
          Generate your Statement of Purpose with AI
        </Text>

        {/* Resume Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Resume (PDF) *</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.uploadButtonText}>
              {resumeFile ? `📄 ${resumeFile.name}` : "📎 Upload Resume PDF"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Target Program */}
        <View style={styles.section}>
          <Text style={styles.label}>Target Program *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Master of Science in Computer Science"
            value={targetProgram}
            onChangeText={setTargetProgram}
            editable={!loading}
          />
        </View>

        {/* Target University */}
        <View style={styles.section}>
          <Text style={styles.label}>Target University *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Stanford University"
            value={targetUniversity}
            onChangeText={setTargetUniversity}
            editable={!loading}
          />
        </View>

        {/* Extra Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>Extra Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional information or specific focus areas..."
            value={extraNotes}
            onChangeText={setExtraNotes}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        {/* Error Display */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.generateButton]}
            onPress={generateSOP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>✨ Generate SOP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearForm}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.clearButtonText]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        {/* SOP Draft Display */}
        {sopDraft ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📝 Generated SOP Draft</Text>
            <View style={styles.sopContainer}>
              <Text style={styles.sopText}>{sopDraft}</Text>
            </View>
            <Text style={styles.disclaimer}>
              💡 Tip: Review and personalize this draft before submission
            </Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by AI • {new Date().getFullYear()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: "#4a90e2",
    borderStyle: "dashed",
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#4a90e2",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  generateButton: {
    backgroundColor: "#4a90e2",
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  clearButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  clearButtonText: {
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#e53935",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 30,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 15,
  },
  sopContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sopText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
  },
  disclaimer: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
