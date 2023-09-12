const MetricsStorage = require("../MetricsStorage");
const { Client } = require("pg");

jest.mock("pg");

describe("MetricsStorage", () => {
  let metricsStorage;
  let mockDbClient;

  beforeEach(() => {
    MetricsStorage.tablesInitialized = false;

    mockDbClient = new Client();
    mockDbClient.query = jest.fn().mockResolvedValue({ rows: [] });
    mockDbClient.connect = jest.fn();
    metricsStorage = new MetricsStorage(mockDbClient);
    mockDbClient.query.mockClear();
  });

  it("should call connect on dbClient", async () => {
    await metricsStorage.connect();
    expect(mockDbClient.connect).toHaveBeenCalled();
  });

  it("should initialize tables correctly", async () => {
    await metricsStorage.initTables();
    expect(mockDbClient.query).toHaveBeenCalledWith(expect.any(String));
  });

  it("should store metrics correctly", async () => {
    const mockMetrics = { responseTime: 100, statusCode: "NOERROR" };
    await metricsStorage.storeMetrics(mockMetrics);
    expect(mockDbClient.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array)
    );
  });

  it("should retrieve metrics without filters", async () => {
    await metricsStorage.getMetrics();
    const lastCallArguments =
      mockDbClient.query.mock.calls[
        mockDbClient.query.mock.calls.length - 1
      ][0];
    expect(lastCallArguments).toContain("SELECT * FROM dns_metrics");
 
  });

  it("should retrieve metrics filtered by time", async () => {
    const options = { startTime: "2021-01-01", endTime: "2021-12-31" };
    await metricsStorage.getMetrics(options);
    expect(mockDbClient.query).toHaveBeenCalledWith(
      expect.stringContaining("time BETWEEN"),
      expect.any(Array)
    );
  });

  it("should retrieve metrics filtered by nameServer", async () => {
    const options = { nameServer: "www.google.com" };
    await metricsStorage.getMetrics(options);
    expect(mockDbClient.query).toHaveBeenCalledWith(
      expect.stringContaining("metrics->>'nameServer'"),
      expect.any(Array)
    );
  });

  it("should handle errors gracefully", async () => {
    mockDbClient.query.mockRejectedValue(new Error("Query failed"));
    await expect(metricsStorage.getMetrics()).rejects.toThrow("Query failed");
  });

  it("should retrieve server health without filters", async () => {
    await metricsStorage.getServerHealth();
    const lastCallArguments =
      mockDbClient.query.mock.calls[
        mockDbClient.query.mock.calls.length - 1
      ][0];
    expect(lastCallArguments).toContain("SELECT * FROM server_health");
  });

  it("should retrieve server health filtered by time", async () => {
    const options = { startTime: "2021-01-01", endTime: "2021-12-31" };
    await metricsStorage.getServerHealth(options);
    expect(mockDbClient.query).toHaveBeenCalledWith(
      expect.stringContaining("time BETWEEN"),
      expect.any(Array)
    );
  });

  it("should retrieve server health filtered by serverName", async () => {
    const options = { serverName: "www.google.com" };
    await metricsStorage.getServerHealth(options);
    expect(mockDbClient.query).toHaveBeenCalledWith(
      expect.stringContaining("domain ="),
      expect.any(Array)
    );
  });

  it("should handle errors gracefully", async () => {
    mockDbClient.query.mockRejectedValue(new Error("Query failed"));
    await expect(metricsStorage.getServerHealth()).rejects.toThrow(
      "Query failed"
    );
  });
});
