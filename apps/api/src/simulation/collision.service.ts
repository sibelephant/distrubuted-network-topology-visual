import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CollisionService {
  private readonly logger = new Logger(CollisionService.name);
  
  // Tracks how many active packets are currently traversing a specific node
  // key: nodeId, value: count of packets
  private activeMediums = new Map<string, number>();

  /**
   * Called when a packet enters a medium
   * @returns true if a collision occurred
   */
  enterMedium(nodeId: string, nodeType: string): boolean {
    const current = this.activeMediums.get(nodeId) || 0;
    this.activeMediums.set(nodeId, current + 1);

    // Collisions primarily happen on L1 Hubs if > 1 packet is traversing
    if (nodeType === 'hub' && current + 1 > 1) {
      this.logger.warn(`💥 COLLISION DETECTED on Hub: ${nodeId} (${current + 1} packets)`);
      return true;
    }

    return false;
  }

  /**
   * Called when a packet leaves a medium
   */
  leaveMedium(nodeId: string): void {
    const current = this.activeMediums.get(nodeId) || 0;
    if (current > 0) {
      this.activeMediums.set(nodeId, current - 1);
    }
  }

  /**
   * Cleans up all mediums for a given topology (if we tracked per topology)
   * Currently global per gateway instance
   */
  reset(): void {
    this.activeMediums.clear();
  }
}
