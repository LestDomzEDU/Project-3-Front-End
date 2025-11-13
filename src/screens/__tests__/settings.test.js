import React from "react";
import renderer from "react-test-renderer";
import SettingsScreen from "../SettingsScreen";

// Mock the AuthContext used by SettingsScreen
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock react-navigation's useNavigation used inside the component
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("SettingsScreen", () => {
  let mockNavigate;
  let useAuth;
  let useNavigation;

  beforeEach(() => {
    // require the mocked modules so we can control return values
    useAuth = require("../../context/AuthContext").useAuth;
    useNavigation = require("@react-navigation/native").useNavigation;

    mockNavigate = jest.fn();

    // default mock implementations
    useNavigation.mockReturnValue({ navigate: mockNavigate });
    useAuth.mockReturnValue({
      me: {
        name: "Test User",
        login: "testuser",
        avatar_url: "https://example.com/avatar.png",
      },
      setMe: jest.fn(),
      refresh: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders correctly (snapshot)", () => {
    const tree = renderer.create(<SettingsScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows the logged-in user's name", () => {
    const rendered = renderer.create(<SettingsScreen />);
    const root = rendered.root;

    const nameNodes = root.findAll(
      (node) =>
        node.type === "Text" &&
        node.props &&
        (node.props.children === "Test User" ||
          node.props.children === "testuser")
    );

    expect(nameNodes.length).toBeGreaterThan(0);
  });

  it("navigates to ProfileIntake when preferences row is pressed", () => {
    const rendered = renderer.create(<SettingsScreen />);
    const root = rendered.root;

    // Find the Pressable/Touchable with the accessibilityLabel used in the component
    const prefRow = root.findAll(
      (node) =>
        node.props &&
        node.props.accessibilityLabel === "Open preferences and see top schools"
    )[0];

    expect(prefRow).toBeDefined();
    // simulate press
    if (typeof prefRow.props.onPress === "function") {
      prefRow.props.onPress();
    } else if (typeof prefRow.props.onClick === "function") {
      prefRow.props.onClick();
    }

    expect(mockNavigate).toHaveBeenCalledWith("ProfileIntake");
  });
});
