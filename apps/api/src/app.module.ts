import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopologyModule } from './topology/topology.module';
import { ExportModule } from './export/export.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [
    TopologyModule,
    ExportModule,
    CollaborationModule,
    SimulationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
