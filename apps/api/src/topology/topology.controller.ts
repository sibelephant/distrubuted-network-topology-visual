import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TopologyService } from './topology.service';
import { CreateTopologyDto } from './dto/create-topology.dto';
import { UpdateTopologyDto } from './dto/update-topology.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('topology')
export class TopologyController {
  constructor(private readonly topologyService: TopologyService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTopologyDto: CreateTopologyDto) {
    return this.topologyService.create(createTopologyDto as any);
  }

  @Get()
  findAll() {
    return this.topologyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topologyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateTopologyDto: UpdateTopologyDto) {
    return this.topologyService.update(id, updateTopologyDto as any);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.topologyService.remove(id);
  }
}
