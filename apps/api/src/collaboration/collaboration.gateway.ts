import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('CollaborationGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTopology')
  handleJoinTopology(
    @MessageBody() topologyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(topologyId);
    this.logger.log(`Client ${client.id} joined topology: ${topologyId}`);
    return { event: 'joined', data: topologyId };
  }

  @SubscribeMessage('node:move')
  handleNodeMove(
    @MessageBody() payload: { topologyId: string; nodeId: string; position: { x: number; y: number } },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(payload.topologyId).emit('node:move', payload);
  }

  @SubscribeMessage('node:update')
  handleNodeUpdate(
    @MessageBody() payload: { topologyId: string; nodeId: string; data: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(payload.topologyId).emit('node:update', payload);
  }

  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @MessageBody() payload: { topologyId: string; userId: string; position: { x: number; y: number } },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast cursor positions to others in the room
    client.to(payload.topologyId).emit('cursor:move', payload);
  }
}
