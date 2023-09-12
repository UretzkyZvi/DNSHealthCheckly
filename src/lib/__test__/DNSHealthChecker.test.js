const DNSHealthChecker = require("../../DNSHealthChecker");
const DNSOperator = require("../DNSOperator");
const ThresholdValidator = require("../ThresholdValidator");
const MetricsStorage = require("../MetricsStorage");

jest.mock("../DNSOperator", () => {
  return jest.fn().mockImplementation(() => ({
    query: jest.fn().mockResolvedValue({
      responseTime: 100,
      statusCode: "NOERROR",
      ttl: 200,
    }),
  }));
});

jest.mock("../ThresholdValidator", () => {
  return jest.fn().mockImplementation(() => ({
    validateResponseTime: jest.fn().mockReturnValue(true),
    validateStatusCode: jest.fn().mockReturnValue(true),
    validateTtl: jest.fn().mockReturnValue(true),
  }));
});

jest.mock("../MetricsStorage");

describe("DNSHealthChecker", () => {
  let dnsHealthChecker, dnsOperator, thresholdValidator, metricsStorage;

  const testSettings = {
    domain: "www.google.com",
    region: "Global",
    metrics: ["responseTime", "statusCode", "ttl"],
    thresholds: {
      responseTime: 200,
      statusCode: "NOERROR",
      ttl: 300,
    },
    checkInterval: 5,
  };

  beforeEach(() => {
    jest.useFakeTimers();

    dnsOperator = new DNSOperator();
    thresholdValidator = new ThresholdValidator();
    metricsStorage = new MetricsStorage();

    dnsHealthChecker = new DNSHealthChecker(
      testSettings,
      metricsStorage,
      dnsOperator
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should initialize correctly", () => {
    expect(dnsHealthChecker.dnsOperator).toBeDefined();
    expect(dnsHealthChecker.validator).toBeDefined();
    expect(dnsHealthChecker.metricsStorage).toBe(metricsStorage);
  });

  it("should handle a healthy DNS query", async () => {
    // Spy on the methods of the validator used within DNSHealthChecker
    const spyValidateResponseTime = jest.spyOn(
      dnsHealthChecker.validator,
      "validateResponseTime"
    );
    const spyValidateStatusCode = jest.spyOn(
      dnsHealthChecker.validator,
      "validateStatusCode"
    );
    const spyValidateTtl = jest.spyOn(
      dnsHealthChecker.validator,
      "validateTtl"
    );

    // Run the DNS health check
    await dnsHealthChecker.checkDNSHealth();

    // Debugging: Log what the mock was actually called with
    if (spyValidateResponseTime.mock.calls.length === 0) {
      console.error("validateResponseTime was not called");
    } else {
      console.log(
        `validateResponseTime was called with: ${JSON.stringify(
          spyValidateResponseTime.mock.calls
        )}`
      );
    }

    expect(spyValidateResponseTime).toHaveBeenCalledWith(100);
    expect(spyValidateStatusCode).toHaveBeenCalledWith("NOERROR");
    expect(spyValidateTtl).toHaveBeenCalledWith(200);

    expect(metricsStorage.storeMetrics).toHaveBeenCalled();
    expect(metricsStorage.storeServerHealth).toHaveBeenCalledWith(
      true,
      "www.google.com",
      "Global"
    );
  });
});
