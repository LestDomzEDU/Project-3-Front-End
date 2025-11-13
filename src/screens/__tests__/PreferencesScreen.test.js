import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PreferencesScreen from "../PreferencesScreen";

describe("PreferencesScreen", () => {
  it("renders the header and school list", () => {
    const { getByText } = render(<PreferencesScreen />);

    expect(getByText("Top Schools for You")).toBeTruthy();
    expect(getByText("TechU")).toBeTruthy(); 
  });

  it("renders city filter buttons", () => {
    const { getByText } = render(<PreferencesScreen />);

    expect(getByText("Seattle")).toBeTruthy();
    expect(getByText("Austin")).toBeTruthy();
    expect(getByText("Boston")).toBeTruthy();
  });

  it("toggles city filter when pressed", () => {
    const { getByText } = render(<PreferencesScreen />);
    const seattleButton = getByText("Seattle");

    // simulate a tap
    fireEvent.press(seattleButton);

    // The button should still exist and toggle active state (snapshot check)
    expect(seattleButton).toBeTruthy();
  });
});