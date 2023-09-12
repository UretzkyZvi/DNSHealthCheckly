class MetricsStorage {
  static tablesInitialized = false;

  constructor(dbClient) {
    this.client = dbClient;
    this.connectAndInit();
  }

  async connectAndInit() {
    await this.connect();
    await this.initTables();
  }

  async initTables() {
    if (MetricsStorage.tablesInitialized) {
      return;
    }

    const createMetricsTable = `
    CREATE TABLE IF NOT EXISTS public.dns_metrics (
        id serial,
        "time" timestamp with time zone NOT NULL,
        metrics jsonb,
        PRIMARY KEY (id)
    );
 
    `;

    const createServerHealthTable = `
      CREATE TABLE IF NOT EXISTS public.server_health (
        id SERIAL PRIMARY KEY,
        time TIMESTAMPTZ NOT NULL,
        is_valid BOOLEAN,
        domain VARCHAR(255),
        region VARCHAR(255)
      );
    `;

    await this.client.query(createMetricsTable);
    await this.client.query(createServerHealthTable);

    MetricsStorage.tablesInitialized = true;
  }

  async connect() {
    await this.client.connect();
  }

  async storeMetrics(metrics) {
    const query = "INSERT INTO dns_metrics(time, metrics) VALUES($1, $2)";
    const values = [new Date(), metrics];
    await this.client.query(query, values);
  }

  async storeServerHealth(isValid, domain, region) {
    const query =
      "INSERT INTO server_health(time, is_valid, domain, region) VALUES($1, $2, $3, $4)";
    const values = [new Date(), isValid, domain, region];
    await this.client.query(query, values);
  }

  async getMetrics(options = {}) {
    let query = "SELECT * FROM dns_metrics";
    const values = [];
    let conditions = [];

    if (options.startTime && options.endTime) {
      conditions.push(
        `time BETWEEN $${values.length + 1} AND $${values.length + 2}`
      );
      values.push(options.startTime, options.endTime);
    }

    if (options.nameServer) {
      conditions.push(`metrics->>'nameServer' = $${values.length + 1}`);
      values.push(options.nameServer);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY time DESC";

    if (options.limit) {
      query += ` LIMIT $${values.length + 1}`;
      values.push(options.limit);
    }

    const result = await this.client.query(query, values);
    return result.rows;
  }

  async getServerHealth(options = {}) {
    let query = "SELECT * FROM server_health";
    const values = [];
    let conditions = [];

    if (options.startTime && options.endTime) {
      conditions.push(
        `time BETWEEN $${values.length + 1} AND $${values.length + 2}`
      );
      values.push(options.startTime, options.endTime);
    }

    if (options.serverName) {
      conditions.push(`domain = $${values.length + 1}`);
      values.push(options.serverName);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY time DESC";

    if (options.limit) {
      query += ` LIMIT $${values.length + 1}`;
      values.push(options.limit);
    }

    const result = await this.client.query(query, values);
    return result.rows;
  }
}

module.exports = MetricsStorage;
