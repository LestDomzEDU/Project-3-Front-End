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
import UploadResume from "../screens/UploadResume";
import GenerateSOPScreen from "../screens/GenerateSOPScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="SavedApplications"
        component={SavedApplicationsScreen}
        options={{ title: "Saved" }}
      />
      <Tab.Screen name="Reminders" component={ReminderScreen} />
      <Tab.Screen name="UploadResume" component={UploadResume} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash / loading at app launch */}
      <Stack.Screen name="Loading" component={LoadingScreen} />

      {/* Entry screen */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* OAuth login */}
      <Stack.Screen name="OAuth" component={OAuthScreen} />

      {/* Onboarding & main app */}
      <Stack.Screen name="ProfileIntake" component={ProfileIntake} />
      <Stack.Screen name="Tabs" component={DashboardTabs} />
      <Stack.Screen name="GenerateSOPScreen" component={GenerateSOPScreen} />
      <Stack.Screen name="GoogleWelcome" component={GoogleWelcomeScreen} />
    </Stack.Navigator>
  );
}
