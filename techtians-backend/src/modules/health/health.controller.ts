import { Controller, Get } from '@nestjs/common';
import { HealthService, HealthCheckResult } from './health.service';
import { Public } from '../../common/decorators';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  check(): HealthCheckResult {
    return this.healthService.getHealth();
  }
}
