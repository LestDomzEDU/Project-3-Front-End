import * as React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Linking } from 'react-native';

export default function SavedApplicationsScreen() {
  // Example saved app data
  const savedApps = [
    { id: '1', name: 'AI Research Fellowship', company: 'OpenAI Scholars', urgent: true, link: 'https://example.com/app1' },
    { id: '2', name: 'Graduate Data Science Internship', company: 'DataQuest Labs', urgent: false, link: 'https://example.com/app2' },
    { id: '3', name: 'PhD Program in ML', company: 'TechU', urgent: true, link: 'https://example.com/app3' },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.appCard}>
      <View style={styles.leftIcon}>
        {item.urgent && <Text style={styles.urgentMark}>❗</Text>}
      </View>

      {/* App info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>{item.name}</Text>
        <Text style={styles.appCompany}>{item.company}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.applyButton, pressed && { opacity: 0.8 }]}
        onPress={() => Linking.openURL(item.link)}
      >
        <Text style={styles.applyText}>Apply</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Apps</Text>

      <FlatList
        data={savedApps}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    color: '#111827',
  },
  listContainer: {
    paddingBottom: 60,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#00000011',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leftIcon: {
    width: 30,
    alignItems: 'center',
  },
  urgentMark: {
    fontSize: 20,
    color: '#EF4444', //red
  },
  appInfo: {
    flex: 1,
    marginHorizontal: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  appCompany: {
    fontSize: 14,
    color: '#64748B',
  },
  applyButton: {
    backgroundColor: '#6366F1', 
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});