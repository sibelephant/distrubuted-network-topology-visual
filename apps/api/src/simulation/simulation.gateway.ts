import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SimulationService } from './simulation.service';
import { StpService } from './stp.service';
import { CollisionService } from './collision.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SimulationGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SimulationGateway.name);

  constructor(
    private readonly simulationService: SimulationService,
    private readonly stpService: StpService,
    private readonly collisionService: CollisionService,
  ) {}

  @SubscribeMessage('simulation:start')
  async handleSimulationStart(
    @MessageBody() payload: { topologyId: string; startNodeId: string; endNodeId: string; nodes: any[]; edges: any[] },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Starting simulation in topology ${payload.topologyId} from ${payload.startNodeId} to ${payload.endNodeId}`);

    // 1. Calculate Spanning Tree to prevent Layer 2 loops
    const blockedEdgesList = this.stpService.calculateSpanningTree(payload.nodes, payload.edges);
    const blockedEdges = new Set(blockedEdgesList);

    // Broadcast STP update to render dashed/greyed-out lines immediately
    this.server.to(payload.topologyId).emit('simulation:stp-update', {
      topologyId: payload.topologyId,
      blockedEdges: blockedEdgesList,
    });

    // 2. Find shortest path considering blocked ports
    const result = await this.simulationService.simulateTraversal(
      payload.nodes,
      payload.edges,
      payload.startNodeId,
      payload.endNodeId,
      blockedEdges
    );

    if (result.success && result.path) {
      // 3. Step-by-step broadcast of packet hops with CSMA/CD logic
      for (let i = 0; i < result.path.length; i++) {
        const currentNodeId = result.path[i];
        const node = payload.nodes.find(n => n.id === currentNodeId);
        
        let collisionDetected = false;
        let retries = 0;
        const maxRetries = 3;

        // CSMA/CD Simulation on Hubs
        while (retries < maxRetries) {
          collisionDetected = this.collisionService.enterMedium(currentNodeId, node?.type || 'unknown');
          
          if (collisionDetected) {
            this.server.to(payload.topologyId).emit('simulation:collision', {
              topologyId: payload.topologyId,
              nodeId: currentNodeId,
            });

            this.collisionService.leaveMedium(currentNodeId);

            // Exponential Backoff
            retries++;
            const backoffTime = Math.random() * (Math.pow(2, retries) * 100);
            this.logger.log(`Collision handled. Backing off for ${Math.round(backoffTime)}ms...`);
            await new Promise((resolve) => setTimeout(resolve, backoffTime));
          } else {
            break; // Successfully reserved medium
          }
        }

        if (collisionDetected && retries >= maxRetries) {
          client.emit('simulation:error', { message: 'Packet dropped due to excessive collisions.' });
          break;
        }

        // Notify all clients in the room about the current hop
        this.server.to(payload.topologyId).emit('simulation:packet-hop', {
          topologyId: payload.topologyId,
          nodeId: currentNodeId,
          step: i,
          isLast: i === result.path.length - 1,
        });

        // Delay between hops for animation (e.g., 500ms)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Release medium when moving to next hop
        this.collisionService.leaveMedium(currentNodeId);
      }
    } else {
      client.emit('simulation:error', { message: 'No valid path found between nodes.' });
    }
  }
}
