// src/common/monitor/event-loop-monitor.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { monitorEventLoopDelay } from 'node:perf_hooks';

@Injectable()
export class EventLoopMonitorService implements OnModuleInit {
  private readonly logger = new Logger(EventLoopMonitorService.name);

  onModuleInit() {
    const h = monitorEventLoopDelay({ resolution: 100 });
    h.enable();

    setInterval(() => {
      const p95 = h.percentile(95) / 1e6; // ms
      if (p95 > 500) {
        this.logger.warn(`⚠️ Event Loop 阻塞异常: p95=${p95.toFixed(2)}ms`);
        console.trace('事件循环卡顿，当前执行堆栈：');
      }
    }, 5000);

    this.logger.log('✅ Event Loop 阻塞监控已启动');
  }
}
