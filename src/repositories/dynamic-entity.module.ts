import { Module, Global } from '@nestjs/common';
import { DynamicEntityRepo } from './dynamic-entity.repo';

@Global()
@Module({
  providers: [DynamicEntityRepo],
  exports: [DynamicEntityRepo],
})
export class DynamicEntityModule {}
