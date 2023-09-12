const DNSOperator = require("./lib/DNSOperator");
const ThresholdValidator = require("./lib/ThresholdValidator");

// User-configurable settings
const userSettings = {
  domain: "www.google.com",
  region: "Global",
  metrics: ["responseTime", "statusCode", "ttl"],
  thresholds: {
    responseTime: 200,
    statusCode: "NOERROR",
    ttl: 300,
  },
};

// Initialize DNSOperator and ThresholdValidator
const dnsOperator = new DNSOperator();
const validator = new ThresholdValidator(userSettings.thresholds);

async function checkDNSHealth() {
  try {
    const metrics = await dnsOperator.query(
      userSettings.domain,
      userSettings.region
    );

    // Validate metrics against thresholds
    // Validate only the user-selected metrics
    for (const metric of userSettings.metrics) {
      // Dynamically construct the validation method name based on the user's selected metric.
      const validateFunction = `validate${
        metric.charAt(0).toUpperCase() + metric.slice(1)
      }`;

      if (typeof validator[validateFunction] === "function") {
        if (!validator[validateFunction](metrics[metric])) {
          throw new Error(
            `${metric} ${metrics[metric]} does not meet the threshold.`
          );
        }
      } else {
        console.warn(`No validation function found for metric: ${metric}`);
      }
    }

    console.log(`DNS query for ${userSettings.domain} is healthy.`);
  } catch (error) {
    console.error(
      `DNS query for ${userSettings.domain} is unhealthy: ${error.message}`
    );
  }
}

// test the function
checkDNSHealth();
