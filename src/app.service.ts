import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getEnviroment(): object {
    return {
      service: 'User Service',
      environment: process.env.environment,
    };
  }
}
