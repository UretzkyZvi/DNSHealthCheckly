class ThresholdValidator {
    constructor(thresholds = {}) {
      // Initialize with default or user-defined thresholds
      this.thresholds = {
        responseTime: thresholds.responseTime || 200, // in milliseconds
        statusCode: thresholds.statusCode || 'NOERROR', // DNS status code
        ttl: thresholds.ttl || 300 // Time to Live in seconds
      };
    }
  
    /**
     * Validates the response time against the threshold.
     * @param {number} responseTime - The response time in milliseconds.
     * @returns {boolean} - True if within threshold, false otherwise.
     */
    validateResponseTime(responseTime) {
      return responseTime <= this.thresholds.responseTime;
    }
  
    /**
     * Validates the DNS status code against the threshold.
     * @param {string} statusCode - The DNS status code.
     * @returns {boolean} - True if matching the expected code, false otherwise.
     */
    validateStatusCode(statusCode) {
      return statusCode === this.thresholds.statusCode;
    }
  
    /**
     * Validates the Time to Live (TTL) against the threshold.
     * @param {number} ttl - The Time to Live in seconds.
     * @returns {boolean} - True if within threshold, false otherwise.
     */
    validateTtl(ttl) {
      return ttl <= this.thresholds.ttl;
    }
  }
  
  module.exports = ThresholdValidator;
  