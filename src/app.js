const DNSOperator = require('./lib/DNSOperator');
const ThresholdValidator = require('./lib/ThresholdValidator');

// Initialize DNSOperator and ThresholdValidator
const dnsOperator = new DNSOperator();
const validator = new ThresholdValidator({ responseTime: 200, statusCode: 'NOERROR', ttl: 300 });

async function checkDNSHealth(domain) {
  try {
    const metrics = await dnsOperator.query(domain, 'Global');

    // Validate metrics against thresholds
    if (!validator.validateResponseTime(metrics.responseTime)) {
      throw new Error(`Response time ${metrics.responseTime}ms exceeds the threshold.`);
    }
    if (!validator.validateStatusCode(metrics.statusCode)) {
      throw new Error(`Status code ${metrics.statusCode} does not match the expected status.`);
    }
    if (!validator.validateTTL(metrics.ttl)) {
      throw new Error(`TTL ${metrics.ttl} is below the threshold.`);
    }

    console.log(`DNS query for ${domain} is healthy.`);
  } catch (error) {
    console.error(`DNS query for ${domain} is unhealthy: ${error.message}`);
  }
}

// test the function
checkDNSHealth('www.google.com');
