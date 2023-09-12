class MetricsStorage {
  constructor(dbClient) {
    this.client = dbClient;
  }

  async connect() {
    await this.client.connect();
  }

  async storeMetrics(metrics) {
    const query = 'INSERT INTO dns_metrics(time, metrics) VALUES($1, $2)';
    const values = [new Date(), metrics];
    await this.client.query(query, values);
  }

  async storeServerHealth(isValid, domain, region) {
    const query = 'INSERT INTO server_health(time, is_valid, domain, region) VALUES($1, $2, $3, $4)';
    const values = [new Date(), isValid, domain, region];
    await this.client.query(query, values);
  }
}

module.exports = MetricsStorage;
