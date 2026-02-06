import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('nodes')
@UseGuards(JwtAuthGuard)
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post()
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodesService.create(createNodeDto);
  }

  @Get()
  findAll() {
    return this.nodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nodesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return this.nodesService.update(id, updateNodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nodesService.remove(id);
  }
}
