describe("Preference Validation", () => {
  // Helper function to validate school matching payload
  const validatePreferencePayload = (payload) => {
    return {
      hasBudget: typeof payload.budget === "number",
      hasGPA: typeof payload.gpa === "number",
      hasSchoolType: ["PRIVATE", "PUBLIC", "BOTH"].includes(payload.schoolType),
      hasEnrollmentType: ["FULL_TIME", "PART_TIME"].includes(
        payload.enrollmentType
      ),
      hasModality: ["IN_PERSON", "HYBRID", "ONLINE"].includes(payload.modality),
      hasRequirementType: ["CAPSTONE", "NEITHER", "GRE", "BOTH"].includes(
        payload.requirementType
      ),
    };
  };

  it("should validate complete preference payload", () => {
    const payload = {
      budget: 50000,
      gpa: 3.5,
      schoolType: "PRIVATE",
      enrollmentType: "FULL_TIME",
      modality: "IN_PERSON",
      requirementType: "NEITHER",
      schoolYear: "2026",
      expectedGrad: "2026-06-15",
    };

    const validation = validatePreferencePayload(payload);
    expect(validation.hasBudget).toBe(true);
    expect(validation.hasGPA).toBe(true);
    expect(validation.hasSchoolType).toBe(true);
    expect(validation.hasEnrollmentType).toBe(true);
    expect(validation.hasModality).toBe(true);
    expect(validation.hasRequirementType).toBe(true);
  });

  it("should reject invalid enum values", () => {
    const payload = {
      budget: 50000,
      gpa: 3.5,
      schoolType: "INVALID",
      enrollmentType: "FULL_TIME",
      modality: "IN_PERSON",
      requirementType: "NEITHER",
    };

    const validation = validatePreferencePayload(payload);
    expect(validation.hasSchoolType).toBe(false);
  });

  it("should reject non-numeric budget/GPA", () => {
    const payload = {
      budget: "not a number",
      gpa: 3.5,
      schoolType: "PRIVATE",
      enrollmentType: "FULL_TIME",
      modality: "IN_PERSON",
      requirementType: "NEITHER",
    };

    const validation = validatePreferencePayload(payload);
    expect(validation.hasBudget).toBe(false);
  });
});
