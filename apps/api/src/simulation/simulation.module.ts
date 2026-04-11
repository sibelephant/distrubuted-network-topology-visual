import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationGateway } from './simulation.gateway';
import { StpService } from './stp.service';
import { CollisionService } from './collision.service';

@Module({
  providers: [SimulationService, SimulationGateway, StpService, CollisionService],
  exports: [SimulationService, StpService, CollisionService],
})
export class SimulationModule {}
