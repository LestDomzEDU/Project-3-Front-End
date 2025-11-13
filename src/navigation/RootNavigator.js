import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import HomeScreen from "../screens/HomeScreen";
import OAuthScreen from "../screens/OAuthScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SavedApplicationsScreen from "../screens/SavedApplicationsScreen";
import ReminderScreen from "../screens/ReminderScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileIntake from "../screens/profileIntake";
// (Optional) You have this file — keep it registered if you still use it
import GoogleWelcomeScreen from "../screens/GoogleWelcomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom tabs shown only AFTER onboarding.
 * Do not put ProfileIntake in here so tabs are hidden during intake.
 */
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

/**
 * Root stack controls the app flow:
 * Home -> OAuth -> ProfileIntake -> Tabs (Dashboard)
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="OAuth" component={OAuthScreen} />
      <Stack.Screen name="ProfileIntake" component={ProfileIntake} />
      <Stack.Screen name="Tabs" component={DashboardTabs} />
      <Stack.Screen name="GoogleWelcome" component={GoogleWelcomeScreen} />
    </Stack.Navigator>
  );
}
