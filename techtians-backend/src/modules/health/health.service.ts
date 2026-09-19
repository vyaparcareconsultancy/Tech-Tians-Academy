import { Injectable } from '@nestjs/common';

export interface HealthCheckResult {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

@Injectable()
export class HealthService {
  getHealth(): HealthCheckResult {
    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
