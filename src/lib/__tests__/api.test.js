import API from "../../lib/api";

describe("API Configuration", () => {
  it("should have BASE_URL defined", () => {
    expect(API.BASE).toBeDefined();
  });

  it("should have OAuth endpoints", () => {
    expect(API.LOGIN_GITHUB).toBeDefined();
    expect(API.LOGIN_DISCORD).toBeDefined();
  });

  it("should have ME endpoint for user session", () => {
    expect(API.ME).toBeDefined();
  });

  it("should have LOGOUT endpoint", () => {
    expect(API.LOGOUT).toBeDefined();
  });

  it("should have OAUTH_FINAL endpoint", () => {
    expect(API.OAUTH_FINAL).toBeDefined();
  });

  it("endpoints should be properly formatted URLs", () => {
    // Check that endpoints start with protocol
    expect(API.LOGIN_GITHUB).toMatch(/^https?:\/\//);
    expect(API.ME).toMatch(/^https?:\/\//);
    expect(API.LOGOUT).toMatch(/^https?:\/\//);
  });

  it("should use correct base URL", () => {
    // All endpoints should include the BASE URL
    expect(API.LOGIN_GITHUB).toContain(API.BASE);
    expect(API.ME).toContain(API.BASE);
    expect(API.LOGOUT).toContain(API.BASE);
  });
});
