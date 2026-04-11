import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopologyModule } from './topology/topology.module';
import { CollaborationModule } from './collaboration/collaboration.module';

@Module({
  imports: [TopologyModule, CollaborationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
