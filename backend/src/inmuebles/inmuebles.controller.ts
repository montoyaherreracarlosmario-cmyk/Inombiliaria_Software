import { Controller, Get, Param, Query } from '@nestjs/common';
import { InmueblesService } from './inmuebles.service';
import { QueryInmueblesDto } from './dto/query-inmuebles.dto';

@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly service: InmueblesService) {}

  @Get()
  findAll(@Query() query: QueryInmueblesDto) {
    return this.service.findAll(query.tipo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
