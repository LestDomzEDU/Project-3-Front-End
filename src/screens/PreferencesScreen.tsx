import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  cardBorder: "#DCE8F2",
};

type School = { id: string; name: string; program: string; city: string; link: string; rank: number };

const ALL_SCHOOLS: School[] = [
  { id: "1", name: "TechU", program: "MS Computer Science", city: "Seattle", link: "https://techu.example", rank: 1 },
  { id: "2", name: "DataState", program: "MS Data Science", city: "Austin", link: "https://datastate.example", rank: 2 },
  { id: "3", name: "Research Institute", program: "PhD ML", city: "Boston", link: "https://research.example", rank: 3 },
];

export default function PreferencesScreen() {
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [track, setTrack] = useState<"CS" | "DS" | "ML" | null>(null);

  const results = useMemo(() => {
    return ALL_SCHOOLS.filter(s =>
      (!cityFilter || s.city === cityFilter) &&
      (!track ||
        (track === "CS" && /computer/i.test(s.program)) ||
        (track === "DS" && /data/i.test(s.program)) ||
        (track === "ML" && /ml|machine/i.test(s.program)))
    ).sort((a, b) => a.rank - b.rank);
  }, [cityFilter, track]);

  const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );

  const renderItem = ({ item }: { item: School }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.sub}>{item.program} • {item.city}</Text>
      <Pressable style={styles.linkBtn} onPress={() => Linking.openURL(item.link)}>
        <Text style={styles.linkBtnText}>View Posting</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Top Schools for You</Text>

      {/* Simple filters */}
      <Text style={styles.filterLabel}>City</Text>
      <View style={styles.row}>
        {["Seattle", "Austin", "Boston"].map(city => (
          <FilterChip key={city} label={city} active={cityFilter === city} onPress={() => setCityFilter(cityFilter === city ? null : city)} />
        ))}
      </View>

      <Text style={[styles.filterLabel, { marginTop: 8 }]}>Track</Text>
      <View style={styles.row}>
        <FilterChip label="CS" active={track === "CS"} onPress={() => setTrack(track === "CS" ? null : "CS")} />
        <FilterChip label="DS" active={track === "DS"} onPress={() => setTrack(track === "DS" ? null : "DS")} />
        <FilterChip label="ML" active={track === "ML"} onPress={() => setTrack(track === "ML" ? null : "ML")} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>No matches yet—adjust your filters.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: PALETTE.bg, 
        paddingHorizontal: 16, 
        paddingTop: 40 
    },
    header: { 
        fontSize: 22, 
        fontWeight: "800", 
        color: PALETTE.text, 
        marginBottom: 12 
    },
    filterLabel: { 
        fontSize: 14, 
        color: PALETTE.navy, 
        fontWeight: "700", 
        marginBottom: 6 
    },
    row: { 
        flexDirection: "row", 
        gap: 8, 
        marginBottom: 8 
    },
    chip: {
        borderWidth: 1, 
        borderColor: PALETTE.cardBorder, 
        borderRadius: 999, 
        paddingVertical: 6, 
        paddingHorizontal: 12,
        backgroundColor: "#F7FDFF",
    },
    chipActive: { 
        backgroundColor: PALETTE.primary, 
        borderColor: PALETTE.primary 
    },
    chipText: { 
        color: PALETTE.navy, 
        fontWeight: "700" 
    },
    chipTextActive: { 
        color: "#fff" 
    },
    card: {
        backgroundColor: "#fff", 
        borderRadius: 16, 
        borderWidth: 1, 
        borderColor: PALETTE.cardBorder,
        padding: 14, 
        marginTop: 10, 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 }, 
        elevation: 1,
    },
    title: { 
        fontSize: 16, 
        fontWeight: "700", 
        color: PALETTE.text 
    },
    sub: { 
        fontSize: 14, 
        color: PALETTE.subtext, 
        marginTop: 2 
    },
    linkBtn: { 
        alignSelf: "flex-start", 
        marginTop: 10, 
        backgroundColor: PALETTE.primary, 
        borderRadius: 10, 
        paddingVertical: 8, 
        paddingHorizontal: 12 
    },
    linkBtnText: { 
        color: "#fff", 
        fontWeight: "800" 
    },
    empty: { 
        textAlign: "center", 
        color: PALETTE.subtext, 
        marginTop: 20 
    },
});