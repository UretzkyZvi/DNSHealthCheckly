const express = require("express");
const app = express();
const port = 3000;

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
  res.json({ message: "Configuration updated." });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
