import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import GoogleWelcomeScreen from "../screens/GoogleWelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import OAuthScreen from "../screens/OAuthScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SavedApplicationsScreen from "../screens/SavedApplicationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileIntake from "../screens/profileIntake";
import ReminderScreen from "../screens/ReminderScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
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

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home" // <-- start app on Home
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="OAuth"
        component={OAuthScreen}
        options={{ title: "OAuth" }}
      />
      <Stack.Screen name="Tabs" component={DashboardTabs} />
      <Stack.Screen
        name="ProfileIntake"
        component={ProfileIntake}
        options={{ title: "Profile Intake" }}
      />
      <Stack.Screen name="GoogleWelcome" component={GoogleWelcomeScreen} />
    </Stack.Navigator>
  );
}
