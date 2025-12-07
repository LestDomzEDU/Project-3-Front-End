import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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

function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,

        // Tab bar colors + style
        tabBarStyle: {
          backgroundColor: "#053F7C", // deep blue
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0,
        },

        tabBarActiveTintColor: "#FFC727",   // gold active
        tabBarInactiveTintColor: "#FFE08A", // light gold inactive

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },

        // ICONS
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SavedApplications") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Reminders") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      <Tab.Screen
        name="SavedApplications"
        component={SavedApplicationsScreen}
        options={{ title: "Saved" }} // keeps your title
      />

      <Tab.Screen name="Reminders" component={ReminderScreen} />
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
      <Stack.Screen name="GoogleWelcome" component={GoogleWelcomeScreen} />
    </Stack.Navigator>
  );
}
