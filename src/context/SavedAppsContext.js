import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SavedAppsContext = createContext({
  savedApps: [],
  addSavedApp: (app) => {},
  removeSavedApp: (id) => {},
});

export function SavedAppsProvider({ children }) {
  const [savedApps, setSavedApps] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("savedApps");
        if (stored) {
          setSavedApps(JSON.parse(stored));
        }
      } catch (e) {
        console.log("Error loading saved apps:", e);
      }
    })();
  }, []);

  function addSavedApp(app) {
    setSavedApps((prev) => {
      if (prev.find((a) => a.id === app.id)) return prev;
      const updated = [app, ...prev];
      AsyncStorage.setItem("savedApps", JSON.stringify(updated));
      return updated;
      // return [app, ...prev];
    });
  }

  function removeSavedApp(id) {
    setSavedApps((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      AsyncStorage.setItem("savedApps", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <SavedAppsContext.Provider
      value={{ savedApps, addSavedApp, removeSavedApp }}
    >
      {children}
    </SavedAppsContext.Provider>
  );
}

export function useSavedApps() {
  return useContext(SavedAppsContext);
}

export default SavedAppsContext;
