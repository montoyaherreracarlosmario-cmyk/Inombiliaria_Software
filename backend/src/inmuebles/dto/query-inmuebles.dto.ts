import { IsIn, IsOptional } from 'class-validator';
import { TIPOS, Tipo } from '../schemas/inmueble.schema';

export class QueryInmueblesDto {
  @IsOptional()
  @IsIn(TIPOS as unknown as string[])
  tipo?: Tipo;
}
