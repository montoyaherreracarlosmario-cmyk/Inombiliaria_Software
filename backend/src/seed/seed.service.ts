import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inmueble } from '../inmuebles/schemas/inmueble.schema';

const F = ['Pepito', 'Juanito', 'Andres'];

/** Datos de ejemplo del prototipo original. */
const INMUEBLES: Partial<Inmueble>[] = [
  { tipo: 'Casa', nombre: 'Casa Piedra Pintada', estado: 'Arrendada', venc: '2026-12-30', diaPago: 5, valor: 1000000, dir: 'Cll 10 # 5 - 20', barrio: 'Piedra Pintada', lind: 'Al norte la calle, al sur la casa #, al este el edificio rojo, al oeste la casa de don Juan.', contratos: [{ vig: true, fecha: '2025-12-30', firm: F }, { vig: false, fecha: '2024-12-30', firm: F }, { vig: false, fecha: '2023-12-30', firm: F }] },
  { tipo: 'Casa', nombre: 'Casa El Vergel', estado: 'Arrendada', venc: '2027-03-15', diaPago: 5, valor: 1200000, dir: 'Cll 12 # 8 - 14', barrio: 'El Vergel', lind: '', contratos: [{ vig: true, fecha: '2026-03-15', firm: ['Maria', 'Luis'] }] },
  { tipo: 'Casa', nombre: 'Casa Jordán', estado: 'Sin arrendar', venc: '', diaPago: 5, valor: 900000, dir: 'Cra 3 # 4 - 10', barrio: 'Jordán', lind: '', contratos: [] },
  { tipo: 'Casa', nombre: 'Casa Interlaken', estado: 'Para la venta', venc: '', diaPago: null, valor: 300000000, dir: 'Cll 20 # 1 - 5', barrio: 'Interlaken', lind: '', contratos: [] },
  { tipo: 'Apartamento', nombre: 'Apto Torres del Parque 302', estado: 'Arrendada', venc: '2026-11-20', diaPago: 10, valor: 850000, dir: 'Cra 5 # 30 - 12 Apto 302', barrio: 'La Pola', lind: '', contratos: [{ vig: true, fecha: '2025-11-20', firm: ['Carlos', 'Ana'] }] },
  { tipo: 'Apartamento', nombre: 'Apto Mirador 601', estado: 'Sin arrendar', venc: '', diaPago: 5, valor: 1100000, dir: 'Cll 60 # 4 - 55 Apto 601', barrio: 'Ambalá', lind: '', contratos: [] },
  { tipo: 'Apartamento', nombre: 'Apto Central 204', estado: 'Para la venta', venc: '', diaPago: null, valor: 210000000, dir: 'Cll 11 # 3 - 40 Apto 204', barrio: 'Centro', lind: '', contratos: [] },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectModel(Inmueble.name) private readonly model: Model<Inmueble>) {}

  async onApplicationBootstrap() {
    if (process.env.SEED === 'false') return;
    if ((await this.model.estimatedDocumentCount()) > 0) return;
    // Insertados uno a uno para conservar el orden de creación.
    for (const inmueble of INMUEBLES) await this.model.create(inmueble);
    this.logger.log(`Base vacía: se cargaron ${INMUEBLES.length} inmuebles de ejemplo`);
  }
}
