import React from "react";
import { render } from "@testing-library/react-native";
import ReminderScreen from "../ReminderScreen";

describe("ReminderScreen", () => {
  it("renders the header and reminders list", () => {
    const { getByText } = render(<ReminderScreen />);

    expect(getByText("Reminders")).toBeTruthy();
    expect(getByText("Application Deadline")).toBeTruthy();
  });

  it("shows a due date text", () => {
    const { getAllByText } = render(<ReminderScreen />);
    const dueItems = getAllByText(/Due:/i);
    expect(dueItems.length).toBeGreaterThan(0);
  });
});