import { PartialType } from '@nestjs/mapped-types';
import { CreateTopologyDto } from './create-topology.dto';

export class UpdateTopologyDto extends PartialType(CreateTopologyDto) {}
