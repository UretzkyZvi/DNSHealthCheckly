const DNSOperator = require("./lib/DNSOperator");
const ThresholdValidator = require("./lib/ThresholdValidator");

class DNSHealthChecker {
  constructor(initialSettings, metricsStorage, dnsOperator = null) {
    this.userSettings = initialSettings;
    // Initialize DNSOperator and ThresholdValidator, and MetricsStorage
    this.dnsOperator = dnsOperator || new DNSOperator();
    this.validator = new ThresholdValidator(this.userSettings.thresholds);
    this.metricsStorage = metricsStorage;
    this.checkIntervalId = null;
    // Start checking
    this.startChecking();
  }
  /**
   * Checks the DNS health.
   * @returns {void}
   * */
  async checkDNSHealth() {
    try {
      const metrics = await this.dnsOperator.query(
        this.userSettings.domain,
        this.userSettings.region
      );

      let allMetricsValid = true;

      // Validate metrics against thresholds
      // Validate only the user-selected metrics
      for (const metric of this.userSettings.metrics) {
        // Dynamically construct the validation method name based on the user's selected metric.
        const validateFunction = `validate${
          metric.charAt(0).toUpperCase() + metric.slice(1)
        }`;

        if (typeof this.validator[validateFunction] === "function") {
          if (!this.validator[validateFunction](metrics[metric])) {
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
      await this.metricsStorage.storeMetrics(metrics);
      // Store the server health
      await this.metricsStorage.storeServerHealth(
        allMetricsValid,
        this.userSettings.domain,
        this.userSettings.region
      );

      if (allMetricsValid) {
        console.log(`DNS query for ${this.userSettings.domain} is healthy.`);
      } else {
        console.warn(`DNS query for ${this.userSettings.domain} had issues.`);
      }
    } catch (error) {
      console.error(
        `DNS query for ${this.userSettings.domain} is unhealthy: ${error.message}`
      );
    }
  }
  /**
   * Updates the settings with new values.
   * @param {Object} newSettings - The new settings.
   * @returns {Object} - The updated settings.
   */
  updateSettings(newSettings) {
    this.userSettings = {
      ...this.userSettings,
      ...newSettings,
    };
    console.log("Updated settings: ", this.userSettings);

    // Update the thresholds in the validator
    if (newSettings.thresholds) {
      this.validator.updateThresholds(newSettings.thresholds);
    }

    // Restart the checking with new settings
    this.restartChecking();
    return this.userSettings;
  }

  /**
   * Restarts the checking with new settings.
   * @returns {void}
   */
  restartChecking() {
    // Clear existing interval
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }

    // Restart with new settings
    this.startChecking();
  }
  /**
   *  Starts the checking.
   *  @returns {void}
   **/
  startChecking() {
    this.checkIntervalId = setInterval(
      () => this.checkDNSHealth(),
      this.userSettings.checkInterval * 1000
    );
  }
}
module.exports = DNSHealthChecker;
