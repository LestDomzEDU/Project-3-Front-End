import { createContext, useContext, useState } from "react";

const SavedAppsContext = createContext({
  savedApps: [],
  addSavedApp: (app) => {},
  removeSavedApp: (id) => {},
});

export function SavedAppsProvider({ children }) {
  const [savedApps, setSavedApps] = useState([]);

  function addSavedApp(app) {
    setSavedApps((prev) => {
      if (prev.find((a) => a.id === app.id)) return prev;
      return [app, ...prev];
    });
  }

  function removeSavedApp(id) {
    setSavedApps((prev) => prev.filter((a) => a.id !== id));
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
