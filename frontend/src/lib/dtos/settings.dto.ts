export interface Settings {
    domain: string,
    region: string,
    metrics: string[],
    thresholds: { [key: string]: any },
    checkInterval: number, // in seconds
}