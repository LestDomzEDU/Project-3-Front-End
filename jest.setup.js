import "@testing-library/jest-native/extend-expect";
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// If you use expo-router anywhere:
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));
