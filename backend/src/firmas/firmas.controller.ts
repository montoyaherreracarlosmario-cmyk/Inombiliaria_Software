import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CrearFirmaDto } from './dto/crear-firma.dto';
import { FirmasService } from './firmas.service';

@Controller()
export class FirmasController {
  constructor(private readonly service: FirmasService) {}

  /** Genera el enlace de firma de un contrato para un inmueble */
  @Post('inmuebles/:id/firmas')
  crear(@Param('id') id: string, @Body() dto: CrearFirmaDto) {
    return this.service.crear(id, dto);
  }

  @Get('firmas/:token')
  obtener(@Param('token') token: string) {
    return this.service.obtener(token);
  }

  /** Firma el contrato; devuelve el inmueble actualizado */
  @Post('firmas/:token/firmar')
  @HttpCode(200)
  firmar(@Param('token') token: string) {
    return this.service.firmar(token);
  }
}
