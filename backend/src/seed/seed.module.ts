import { Module } from '@nestjs/common';
import { InmueblesModule } from '../inmuebles/inmuebles.module';
import { SeedService } from './seed.service';

@Module({ imports: [InmueblesModule], providers: [SeedService] })
export class SeedModule {}
