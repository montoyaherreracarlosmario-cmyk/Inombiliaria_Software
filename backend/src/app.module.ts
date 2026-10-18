import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
import { InmueblesModule } from './inmuebles/inmuebles.module';
import { FirmasModule } from './firmas/firmas.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('Falta la variable de entorno MONGODB_URI');
        }
        return { uri, serverSelectionTimeoutMS: 15000 };
      },
    }),
    InmueblesModule,
    FirmasModule,
    SeedModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
