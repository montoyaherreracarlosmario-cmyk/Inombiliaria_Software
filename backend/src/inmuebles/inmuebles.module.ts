import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InmueblesController } from './inmuebles.controller';
import { InmueblesService } from './inmuebles.service';
import { Inmueble, InmuebleSchema } from './schemas/inmueble.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Inmueble.name, schema: InmuebleSchema }])],
  controllers: [InmueblesController],
  providers: [InmueblesService],
  exports: [MongooseModule, InmueblesService],
})
export class InmueblesModule {}
