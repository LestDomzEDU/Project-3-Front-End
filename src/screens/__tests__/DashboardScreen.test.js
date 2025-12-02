// DashboardScreen.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import DashboardScreen from "../DashboardScreen";
import { SavedAppsProvider } from "../../context/SavedAppsContext";

// Helper to wrap component with providers
const renderWithProviders = (component, navigationParams = {}) => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    ...navigationParams.navigation,
  };

  const mockRoute = {
    params: {},
    ...navigationParams.route,
  };

  return render(
    <SavedAppsProvider>
      {React.cloneElement(component, {
        navigation: mockNavigation,
        route: mockRoute,
      })}
    </SavedAppsProvider>
  );
};

describe("DashboardScreen - End-to-End Tests", () => {
  // Test 1: Component renders without crashing
  test("E2E-001: renders dashboard screen successfully", () => {
    const { getByText } = renderWithProviders(<DashboardScreen />);
    expect(getByText("Dashboard")).toBeTruthy();
  });

  // Test 2: Empty state display
  test("E2E-002: displays empty state when no schools provided", () => {
    const { getByText } = renderWithProviders(<DashboardScreen />);
    expect(getByText("No matches yet.")).toBeTruthy();
  });

  // Test 3: Display schools from route params
  test("E2E-003: displays schools passed from ProfileIntake", () => {
    const mockSchools = [
      {
        id: "1",
        name: "Stanford University",
        programName: "Computer Science MS",
        websiteUrl: "https://stanford.edu",
      },
      {
        id: "2",
        name: "MIT",
        programName: "Electrical Engineering PhD",
        websiteUrl: "https://mit.edu",
      },
    ];

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      route: { params: { topSchools: mockSchools } },
    });

    expect(getByText("Stanford University")).toBeTruthy();
    expect(getByText("Computer Science MS")).toBeTruthy();
    expect(getByText("MIT")).toBeTruthy();
    expect(getByText("Electrical Engineering PhD")).toBeTruthy();
  });

  // Test 4: Save application functionality
  test("E2E-004: can save an application", async () => {
    const mockSchools = [
      {
        id: "1",
        name: "Georgia Tech",
        programName: "MS Computer Science",
        websiteUrl: "https://gatech.edu",
      },
    ];

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      route: { params: { topSchools: mockSchools } },
    });

    // Find and click Save button
    const saveButton = getByText("Save");
    fireEvent.press(saveButton);

    // Button should change to "Remove"
    await waitFor(() => {
      expect(getByText("Remove")).toBeTruthy();
    });
  });

  // Test 5: Navigate to Saved Applications
  test("E2E-005: navigates to Saved Applications screen", () => {
    const mockNavigation = { navigate: jest.fn() };

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      navigation: mockNavigation,
    });

    const savedButton = getByText("Saved");
    fireEvent.press(savedButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("Saved Applications");
  });

  // Test 6: Handle school without website
  test("E2E-006: displays 'No website' for schools without URL", () => {
    const mockSchools = [
      {
        id: "1",
        name: "Local College",
        programName: "General Studies",
        websiteUrl: null,
      },
    ];

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      route: { params: { topSchools: mockSchools } },
    });

    expect(getByText("No website")).toBeTruthy();
  });

  // Test 7: Open Models modal
  test("E2E-007: opens Models modal when Show Models clicked", async () => {
    const mockSchools = [
      {
        id: "1",
        name: "Cornell",
        programName: "Engineering PhD",
      },
    ];

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      route: { params: { topSchools: mockSchools } },
    });

    const showModelsButton = getByText("Show Models");
    fireEvent.press(showModelsButton);

    await waitFor(() => {
      expect(getByText("Models")).toBeTruthy();
    });
  });

  // Test 8: Handle multiple schools
  test("E2E-008: displays multiple schools correctly", () => {
    const mockSchools = [
      {
        id: "1",
        name: "Princeton",
        programName: "Physics PhD",
      },
      {
        id: "2",
        name: "Caltech",
        programName: "Astronomy MS",
      },
      {
        id: "3",
        name: "Duke",
        programName: "Medicine MD",
      },
    ];

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      route: { params: { topSchools: mockSchools } },
    });

    expect(getByText("Princeton")).toBeTruthy();
    expect(getByText("Caltech")).toBeTruthy();
    expect(getByText("Duke")).toBeTruthy();
  });

  // Test 9: Handle school with missing fields
  test("E2E-009: handles schools with missing fields gracefully", () => {
    const mockSchools = [
      {
        id: "1",
        // Missing name, programName, websiteUrl
      },
    ];

    const { getByText } = renderWithProviders(<DashboardScreen />, {
      route: { params: { topSchools: mockSchools } },
    });

    expect(getByText("Untitled")).toBeTruthy();
    expect(getByText("Program info")).toBeTruthy();
    expect(getByText("No website")).toBeTruthy();
  });
});

// import React from "react";
// import renderer from "react-test-renderer";
// import DashboardScreen from "../DashboardScreen";

// // Mock the SavedAppsContext used by the Dashboard so tests don't depend on app state
// jest.mock("../../context/SavedAppsContext", () => ({
//   useSavedApps: () => ({
//     savedApps: [],
//     addSavedApp: jest.fn(),
//     removeSavedApp: jest.fn(),
//   }),
// }));

// describe("DashboardScreen", () => {
//   it("renders correctly (snapshot)", () => {
//     const navigation = { navigate: jest.fn() };
//     const tree = renderer
//       .create(<DashboardScreen navigation={navigation} />)
//       .toJSON();
//     expect(tree).toMatchSnapshot();
//   });

//   it("contains the Dashboard title and a sample college", () => {
//     const navigation = { navigate: jest.fn() };
//     const rendered = renderer.create(
//       <DashboardScreen navigation={navigation} />
//     );
//     const root = rendered.root;

//     // look for Text node with children === 'Dashboard'
//     const titleNodes = root.findAll(
//       (node) => node.props && node.props.children === "Dashboard"
//     );
//     expect(titleNodes.length).toBeGreaterThan(0);

//     // check for one of the sample colleges (TechU)
//     const collegeNodes = root.findAll(
//       (node) => node.props && node.props.children === "Georgia Tech"
//     );
//     expect(collegeNodes.length).toBeGreaterThan(0);
//   });
// });
