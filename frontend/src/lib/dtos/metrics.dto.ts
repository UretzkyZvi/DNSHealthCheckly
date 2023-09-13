export interface Metrics {
  id: number;
  time: string;
  metrics: {
    responseTime: number;
    statusCode: string;
    ttl: number;
    nameServer: string;
    region: string;
  }
}