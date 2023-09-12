const express = require("express");
const DNSHealthChecker = require("./DNSHealthChecker");
const MetricsStorage = require("./lib/MetricsStorage");
const { Client } = require("pg");

const dbClient = new Client({
  host: "postgres", // docker-compose.yml service name
  port: 5432,
  user: "postgres",
  password: "P@ssw0rd",
  database: "dnshealthcheckly",
});

const app = express();
const port = 3000;
const metricsStorage = new MetricsStorage(dbClient);
const healthChecker = new DNSHealthChecker(userSettings, dbClient);

const userSettings = {
  domain: "www.google.com",
  region: "Global",
  metrics: ["responseTime", "statusCode", "ttl"],
  thresholds: {
    responseTime: 200,
    statusCode: "NOERROR",
    ttl: 300,
  },
  checkInterval: 5, // in seconds
};


app.use(express.json());

// Endpoint to get current configuration
app.get("/config", (req, res) => {
  res.json(userSettings);
});

// Endpoint to update configuration
app.post("/config", (req, res) => {
  // Here, add some validation for incoming settings if needed
  Object.assign(userSettings, req.body);
  healthChecker.updateSettings(userSettings);
  res.json({ message: "Configuration updated." });
});

// Endpoint to get DNS metrics
app.get("/metrics", async (req, res) => {
  try {
    const metrics = await metricsStorage.getMetrics(req.query);
    res.json(metrics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve metrics", error: error.message });
  }
});

// Endpoint to get server health
app.get("/server-health", async (req, res) => {
  try {
    const healthData = await metricsStorage.getServerHealth(req.query);
    res.json(healthData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve server health",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
