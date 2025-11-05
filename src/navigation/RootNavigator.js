import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import OAuthScreen from '../screens/OAuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SavedApplicationsScreen from '../screens/SavedApplicationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReminderScreen from '../screens/ReminderScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Saved Applications" component={SavedApplicationsScreen} />
      <Tab.Screen name="Reminders" component={ReminderScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OAuth" component={OAuthScreen} options={{ title: 'OAuth' }} />
      <Stack.Screen name="Tabs" component={DashboardTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
