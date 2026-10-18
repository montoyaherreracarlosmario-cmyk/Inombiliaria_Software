import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';

/** Datos del formulario de contrato (arriendo o compraventa). */
export class DatosContratoDto {
  @IsOptional() @IsString() @MaxLength(120) arr?: string; // arrendador
  @IsOptional() @IsString() @MaxLength(120) ate?: string; // arrendatario
  @IsOptional() @IsString() @MaxLength(120) vend?: string; // vendedor
  @IsOptional() @IsString() @MaxLength(120) comp?: string; // comprador

  @IsOptional() @IsArray() @ArrayMaxSize(10) @IsString({ each: true }) @MaxLength(120, { each: true })
  cods?: string[]; // codeudores

  @IsOptional() @IsString() @MaxLength(80) ciu?: string;
  @IsOptional() @IsString() @MaxLength(200) dir?: string;
  @IsOptional() @IsString() @MaxLength(80) bar?: string;
  @IsOptional() @IsString() @MaxLength(1000) lin?: string;

  @IsNumber() @Min(0) val!: number; // canon mensual o precio de venta
  @IsOptional() @IsInt() @Min(1) @Max(600) dur?: number; // meses
  @IsOptional() @IsInt() @Min(1) @Max(31) dia?: number; // día de pago
  @IsOptional() @IsString() @MaxLength(200) pago?: string; // forma de pago
}

export class CrearFirmaDto {
  @IsIn(['arriendo', 'venta'])
  modo!: 'arriendo' | 'venta';

  @ValidateNested()
  @Type(() => DatosContratoDto)
  datos!: DatosContratoDto;
}
