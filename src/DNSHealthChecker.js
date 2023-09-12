const DNSOperator = require("./lib/DNSOperator");
const ThresholdValidator = require("./lib/ThresholdValidator");
const MetricsStorage = require("./lib/MetricsStorage");
 

class DNSHealthChecker {
  constructor(initialSettings, dbClient) {
    this.settings = initialSettings;
    // Initialize DNSOperator and ThresholdValidator, and MetricsStorage
    this.dnsOperator = new DNSOperator();
    this.validator = new ThresholdValidator(userSettings.thresholds);
    this.dbClient = dbClient;
    this.metricsStorage = new MetricsStorage(this.dbClient);
    // Start checking
    this.startChecking();
  }
  async checkDNSHealth() {
    try {
      const metrics = await dnsOperator.query(
        userSettings.domain,
        userSettings.region
      );

      let allMetricsValid = true;

      // Validate metrics against thresholds
      // Validate only the user-selected metrics
      for (const metric of userSettings.metrics) {
        // Dynamically construct the validation method name based on the user's selected metric.
        const validateFunction = `validate${
          metric.charAt(0).toUpperCase() + metric.slice(1)
        }`;

        if (typeof validator[validateFunction] === "function") {
          if (!validator[validateFunction](metrics[metric])) {
            allMetricsValid = false;
            console.warn(
              `${metric} ${metrics[metric]} does not meet the threshold.`
            );
          }
        } else {
          console.warn(`No validation function found for metric: ${metric}`);
        }
      }

      // Store the metrics
      await metricsStorage.storeMetrics(metrics);
      // Store the server health
      await metricsStorage.storeServerHealth(
        allMetricsValid,
        userSettings.domain,
        userSettings.region
      );

      if (allMetricsValid) {
        console.log(`DNS query for ${userSettings.domain} is healthy.`);
      } else {
        console.warn(`DNS query for ${userSettings.domain} had issues.`);
      }
    } catch (error) {
      console.error(
        `DNS query for ${userSettings.domain} is unhealthy: ${error.message}`
      );
    }
  }

  startChecking() {
    setInterval(
      () => this.checkDNSHealth(),
      this.settings.checkInterval * 1000
    );
  }
}
module.exports = DNSHealthChecker;
