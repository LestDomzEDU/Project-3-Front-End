import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileIntake from "../profileIntake";

// Mock navigation
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("ProfileIntake Form", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // Test 1: Component renders correctly
  test("renders ProfileIntake screen with title", () => {
    const { getByText } = render(<ProfileIntake />);
    expect(getByText("Profile Intake")).toBeTruthy();
    expect(
      getByText("Tell us about your application preferences")
    ).toBeTruthy();
  });

  test("enters the budget correctly", () => {
    const { getByDisplayValue } = render(<ProfileIntake />);
    const budgetInput = getByDisplayValue("30000");

    fireEvent.changeText(budgetInput, "15000");
    expect(budgetInput.props.value).toBe("15000");
  });

  // Test 3: Form submission navigates to Tabs
  test("submits form and navigates to Tabs", async () => {
    const { getByText } = render(<ProfileIntake />);
    const submitButton = getByText("Save profile");
    fireEvent.press(submitButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("Tabs");
    });
  });
});
