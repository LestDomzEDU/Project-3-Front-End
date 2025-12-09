describe("Response Parsing", () => {
  // Helper function to safely parse JSON responses
  const parseResponse = async (response) => {
    const contentType = response.headers?.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.slice(0, 100)}`);
    }

    return await response.json();
  };

  it("should parse valid JSON response", async () => {
    const mockResponse = {
      ok: true,
      headers: { get: () => "application/json" },
      text: jest.fn(),
      json: jest.fn(() => Promise.resolve({ success: true })),
    };

    const result = await parseResponse(mockResponse);
    expect(result.success).toBe(true);
  });

  it("should reject non-JSON response", async () => {
    const mockResponse = {
      ok: true,
      headers: { get: () => "text/html" },
      text: jest.fn(() => Promise.resolve("<html>Error</html>")),
      json: jest.fn(),
    };

    await expect(parseResponse(mockResponse)).rejects.toThrow("Expected JSON");
  });

  it("should handle missing content-type header", async () => {
    const mockResponse = {
      ok: true,
      headers: { get: () => null },
      text: jest.fn(() => Promise.resolve('{"error":"Unknown format"}')),
      json: jest.fn(),
    };

    await expect(parseResponse(mockResponse)).rejects.toThrow("Expected JSON");
  });
});

describe("Error Handling", () => {
  const handleFetchError = (error) => {
    if (error instanceof TypeError && error.message === "Network error") {
      return "Network connection failed";
    }
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return "Invalid response format from server";
    }
    return "An unexpected error occurred";
  };

  it("should identify network errors", () => {
    const error = new TypeError("Network error");
    const message = handleFetchError(error);
    expect(message).toBe("Network connection failed");
  });

  it("should identify JSON parse errors", () => {
    const error = new SyntaxError("JSON.parse error");
    const message = handleFetchError(error);
    expect(message).toBe("Invalid response format from server");
  });

  it("should provide generic error message for unknown errors", () => {
    const error = new Error("Unknown error");
    const message = handleFetchError(error);
    expect(message).toBe("An unexpected error occurred");
  });
});
