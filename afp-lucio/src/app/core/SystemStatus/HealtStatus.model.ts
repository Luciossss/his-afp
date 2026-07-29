export interface HealthStatus {
  service: string;
  database: string;
  uptime: number;
}

export const HealthStatusMock: HealthStatus = {
    service:  'KO',
    database: 'OK',
    uptime: -1,
}