import { Controller, Get, Param, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import type { Response } from 'express';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get(':id/packet-tracer')
  async exportPacketTracer(@Param('id') id: string, @Res() res: Response) {
    const xml = await this.exportService.generatePacketTracerXml(id);
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="topology-${id}.pkt"`);
    return res.send(xml);
  }
}
