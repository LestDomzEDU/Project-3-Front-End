import React from "react";
import renderer from "react-test-renderer";
import DashboardScreen from "../DashboardScreen";

// Mock the SavedAppsContext used by the Dashboard so tests don't depend on app state
jest.mock("../../context/SavedAppsContext", () => ({
  useSavedApps: () => ({
    savedApps: [],
    addSavedApp: jest.fn(),
    removeSavedApp: jest.fn(),
  }),
}));

describe("DashboardScreen", () => {
  it("renders correctly (snapshot)", () => {
    const navigation = { navigate: jest.fn() };
    const tree = renderer
      .create(<DashboardScreen navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("contains the Dashboard title and a sample college", () => {
    const navigation = { navigate: jest.fn() };
    const rendered = renderer.create(
      <DashboardScreen navigation={navigation} />
    );
    const root = rendered.root;

    // look for Text node with children === 'Dashboard'
    const titleNodes = root.findAll(
      (node) => node.props && node.props.children === "Dashboard"
    );
    expect(titleNodes.length).toBeGreaterThan(0);

    // check for one of the sample colleges (TechU)
    const collegeNodes = root.findAll(
      (node) => node.props && node.props.children === "Georgia Tech"
    );
    expect(collegeNodes.length).toBeGreaterThan(0);
  });
});
