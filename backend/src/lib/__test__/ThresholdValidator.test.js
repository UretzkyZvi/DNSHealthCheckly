const ThresholdValidator = require("../ThresholdValidator");

describe("ThresholdValidator", () => {
  // Test 1: Initialization
  it("should initialize with default thresholds if none are provided", () => {
    const validator = new ThresholdValidator();
    expect(validator.thresholds).toEqual({
      responseTime: 200,
      statusCode: "NOERROR",
      ttl: 300,
    });
  });

  it("should initialize with user-defined thresholds if provided", () => {
    const validator = new ThresholdValidator({
      responseTime: 100,
      statusCode: "NXDOMAIN",
      ttl: 150,
    });
    expect(validator.thresholds).toEqual({
      responseTime: 100,
      statusCode: "NXDOMAIN",
      ttl: 150,
    });
  });

  // Test 2: Response Time Validation
  it("should validate response time correctly", () => {
    const validator = new ThresholdValidator({ responseTime: 200 });
    expect(validator.validateResponseTime(100)).toBe(true);
    expect(validator.validateResponseTime(200)).toBe(true);
    expect(validator.validateResponseTime(201)).toBe(false);
  });

  // Test 3: Status Code Validation
  it("should validate status code correctly", () => {
    const validator = new ThresholdValidator({ statusCode: "NOERROR" });
    expect(validator.validateStatusCode("NOERROR")).toBe(true);
    expect(validator.validateStatusCode("NXDOMAIN")).toBe(false);
  });

  // Test 4: TTL Validation
  it("should validate TTL correctly", () => {
    const validator = new ThresholdValidator({ ttl: 300 });
    expect(validator.validateTtl(200)).toBe(true);
    expect(validator.validateTtl(300)).toBe(true);
    expect(validator.validateTtl(301)).toBe(false);
  });
});
