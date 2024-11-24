import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getEnvironment(): object {
    return {
      service: 'User Service',
      environment: process.env.environment,
    };
  }
}
