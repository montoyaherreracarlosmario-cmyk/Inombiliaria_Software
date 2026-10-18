import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InmueblesModule } from '../inmuebles/inmuebles.module';
import { FirmasController } from './firmas.controller';
import { FirmasService } from './firmas.service';
import { Firma, FirmaSchema } from './schemas/firma.schema';

@Module({
  imports: [InmueblesModule, MongooseModule.forFeature([{ name: Firma.name, schema: FirmaSchema }])],
  controllers: [FirmasController],
  providers: [FirmasService],
})
export class FirmasModule {}
