class MetricsStorage {
  constructor(dbClient) {
    this.client = dbClient;
  }

  async connect() {
    await this.client.connect();
  }

  async storeResult(metrics, isValid) {
    const query =
      "INSERT INTO dns_checks(time, metrics, is_valid) VALUES($1, $2, $3)";
    const values = [new Date(), metrics, isValid];
    await this.client.query(query, values);
  }
}

module.exports = MetricsStorage;
