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
import GoogleWelcomeScreen from "../screens/GoogleWelcomeScreen";
import LoadingScreen from "../screens/LoadingScreen"; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom tabs (visible after onboarding/login)
 */
function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Dashboard" // ✅ was "Home" which doesn't exist in tabs
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="Saved Applications"
        component={SavedApplicationsScreen}
      />
      <Tab.Screen name="Reminders" component={ReminderScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

/**
 * Root stack controls the main app flow:
 * Home -> OAuth -> Loading -> ProfileIntake -> Tabs (Dashboard)
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Entry screen */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* OAuth login */}
      <Stack.Screen name="OAuth" component={OAuthScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="ProfileIntake" component={ProfileIntake} />
      <Stack.Screen name="Tabs" component={DashboardTabs} />
      <Stack.Screen name="GoogleWelcome" component={GoogleWelcomeScreen} />
    </Stack.Navigator>
  );
}