import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@dntv/database';

@Injectable()
export class ExportService {
  /**
   * Generates a best-effort XML structure representing a Cisco Packet Tracer .pkt file configuration.
   * Note: The true PKT format is compressed and proprietary; this outputs a readable XML topology
   * schema that can be adapted.
   */
  async generatePacketTracerXml(id: string): Promise<string> {
    const topology = await prisma.topology.findUnique({
      where: { id },
    });

    if (!topology) {
      throw new NotFoundException(`Topology with ID ${id} not found`);
    }

    const { nodes, edges } = topology as any; // Assuming JSON storage matching PRD requirements

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<PacketTracerTopology version="8.2">\n`;
    xml += `  <Devices>\n`;

    if (Array.isArray(nodes)) {
      nodes.forEach((node) => {
        const typeMapping = this.mapTypeToCisco(node.type);
        xml += `    <Device id="${node.id}" type="${typeMapping}" x="${node.position?.x}" y="${node.position?.y}">\n`;
        xml += `      <Name>${node.data?.label || node.id}</Name>\n`;
        // Generic best-effort interface mapping
        xml += `      <Interfaces>\n`;
        xml += `        <Interface id="Fa0/0" type="FastEthernet" status="up" />\n`;
        xml += `      </Interfaces>\n`;
        xml += `    </Device>\n`;
      });
    }

    xml += `  </Devices>\n`;
    xml += `  <Links>\n`;

    if (Array.isArray(edges)) {
      edges.forEach((edge) => {
        xml += `    <Link id="${edge.id}" source="${edge.source}" target="${edge.target}" type="Copper Straight-Through">\n`;
        xml += `       <SourceInterface>Fa0/0</SourceInterface>\n`;
        xml += `       <TargetInterface>Fa0/0</TargetInterface>\n`;
        xml += `    </Link>\n`;
      });
    }

    xml += `  </Links>\n`;
    xml += `</PacketTracerTopology>`;

    return xml;
  }

  private mapTypeToCisco(type: string): string {
    switch (type) {
      case 'router':
        return 'Router-2911';
      case 'switch':
        return 'Switch-2960';
      case 'host':
        return 'PC';
      case 'hub':
        return 'Hub';
      default:
        return 'GenericDevice';
    }
  }
}
