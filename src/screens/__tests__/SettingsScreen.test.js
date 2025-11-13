import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from "../SettingsScreen";
import { Alert } from "react-native";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("SettingsScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders user profile information", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("johndoe@email.com")).toBeTruthy();
  });

  it("renders Preferences section and button", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Preferences")).toBeTruthy();
    expect(getByText("Find Top Schools by Preferences")).toBeTruthy();
  });

  it("navigates to Preferences when the Preferences button is pressed", () => {
    const { getByLabelText } = render(<SettingsScreen />);
    const preferencesButton = getByLabelText("Open preferences and see top schools");
    fireEvent.press(preferencesButton);

    expect(mockNavigate).toHaveBeenCalledWith("Preferences");
  });
});