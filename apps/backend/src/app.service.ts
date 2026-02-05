import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private startTime: number = Date.now();

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: (Date.now() - this.startTime) / 1000,
    };
  }
}
