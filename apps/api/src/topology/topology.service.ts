import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Prisma } from '@dntv/database';

@Injectable()
export class TopologyService {
  async findAll() {
    return prisma.topology.findMany({
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const topology = await prisma.topology.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    if (!topology) throw new NotFoundException(`Topology with ID ${id} not found`);
    return topology;
  }

  async create(data: Prisma.TopologyCreateInput) {
    return prisma.topology.create({ data });
  }

  async update(id: string, data: Prisma.TopologyUpdateInput) {
    return prisma.topology.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return prisma.topology.delete({ where: { id } });
  }
}
