import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Modal,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

type RootNavParamList = {
  Tabs: undefined;
  [key: string]: object | undefined;
};

interface SelectFieldProps {
  label: string;
  value?: string | null;
  options?: string[];
  onChange: (v: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options = [],
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>{value ?? "Select"}</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              )}
            />

            <Pressable style={styles.modalClose} onPress={() => setOpen(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function ProfileIntake() {
  const navigation = useNavigation() as NavigationProp<RootNavParamList>;

  const [budget, setBudget] = React.useState<number>(30000);
  const [budgetText, setBudgetText] = React.useState<string>(String(30000));
  const [gpa, setGpa] = React.useState<number>(3.5);
  const [gpaText, setGpaText] = React.useState<string>(String(3.5));

  const [country, setCountry] = React.useState<string | null>(null);
  const [applyYear, setApplyYear] = React.useState<string>("2026");
  const [gradDate, setGradDate] = React.useState<string>("");
  const [isPrivate, setIsPrivate] = React.useState<boolean | null>(null);
  const [stateLocation, setStateLocation] = React.useState<string | null>(null);
  const [major, setMajor] = React.useState<string>("");
  const [capstone, setCapstone] = React.useState<boolean>(false);
  const [timeType, setTimeType] = React.useState<string>("Full-time");
  const [format, setFormat] = React.useState<string>("In person");
  const [gre, setGre] = React.useState<boolean>(false);

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Other",
  ];
  const years = ["2025", "2026", "2027", "2028"];
  const states = ["CA", "NY", "TX", "WA", "Other"];
  const privateOptions = ["Private", "Public"];
  const timeOptions = ["Full-time", "Part-time"];
  const formatOptions = ["In person", "Hybrid", "Online"];

  const handleSubmit = () => {
    const parsedBudget = parseFloat(budgetText);
    const parsedGpa = parseFloat(gpaText);

    setBudget(Number.isFinite(parsedBudget) ? parsedBudget : 0);
    setGpa(Number.isFinite(parsedGpa) ? parsedGpa : 0);

    const profile = {
      country,
      budget: Number.isFinite(parsedBudget) ? parsedBudget : 0,
      gpa: Number.isFinite(parsedGpa) ? parsedGpa : 0,
      applyYear,
      gradDate,
      isPrivate,
      stateLocation,
      major,
      capstone,
      timeType,
      format,
      gre,
    };

    console.log("Saved preferences:", profile);
    navigation.navigate("Tabs" as never); // Go to Dashboard
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Profile Intake</Text>
          <Text style={styles.subtitle}>
            Tell us about your application preferences
          </Text>

          <SelectField
            label="Target Country"
            value={country}
            options={countries}
            onChange={setCountry}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Budget (USD)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={budgetText}
              onChangeText={setBudgetText}
              onBlur={() => {
                const n = parseFloat(budgetText);
                const final = Number.isFinite(n) ? n : 0;
                setBudget(final);
                setBudgetText(String(final));
              }}
            />
          </View>

          <SelectField
            label="School Year to Apply"
            value={applyYear}
            options={years}
            onChange={setApplyYear}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Expected Graduation Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={gradDate}
              onChangeText={setGradDate}
            />
          </View>

          <SelectField
            label="Private or Public"
            value={
              isPrivate ? "Private" : isPrivate === false ? "Public" : null
            }
            options={privateOptions}
            onChange={(v) => setIsPrivate(v === "Private")}
          />

          <SelectField
            label="Location State"
            value={stateLocation}
            options={states}
            onChange={setStateLocation}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Field / Major</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Computer Science"
              value={major}
              onChangeText={setMajor}
            />
          </View>

          <View style={styles.inlineField}>
            <Text style={styles.label}>Capstone Required?</Text>
            <Switch value={capstone} onValueChange={setCapstone} />
          </View>

          <SelectField
            label="Full-time or Part-time"
            value={timeType}
            options={timeOptions}
            onChange={setTimeType}
          />

          <SelectField
            label="Program Format"
            value={format}
            options={formatOptions}
            onChange={setFormat}
          />

          <View style={styles.field}>
            <Text style={styles.label}>GPA (e.g., 3.5)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={gpaText}
              onChangeText={setGpaText}
              onBlur={() => {
                const n = parseFloat(gpaText);
                const final = Number.isFinite(n) ? n : 0;
                setGpa(final);
                setGpaText(String(final));
              }}
            />
          </View>

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Preferences</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 12,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000000",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  select: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  selectText: { color: "#111827" },
  inlineField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalItemText: { fontSize: 15 },
  modalClose: { marginTop: 8, alignSelf: "flex-end" },
  modalCloseText: { color: "#007AFF", fontWeight: "700" },
});
