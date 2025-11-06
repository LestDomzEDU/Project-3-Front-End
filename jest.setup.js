// jest.setup.js
import "@testing-library/jest-native/extend-expect";

// Polyfill setImmediate and clearImmediate for React Native StatusBar
global.setImmediate =
  global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
global.clearImmediate = global.clearImmediate || global.clearTimeout;

// Mock @react-navigation/native
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
  };
});

// Mock StatusBar to prevent clearImmediate issues
jest.mock("react-native/Libraries/Components/StatusBar/StatusBar", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: jest.fn(() => null),
  };
});

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
