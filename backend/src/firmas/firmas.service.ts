import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model, isValidObjectId } from 'mongoose';
import { Inmueble } from '../inmuebles/schemas/inmueble.schema';
import { CrearFirmaDto } from './dto/crear-firma.dto';
import { Firma } from './schemas/firma.schema';

const hoyISO = () => new Date().toISOString().slice(0, 10);

@Injectable()
export class FirmasService {
  constructor(
    @InjectModel(Firma.name) private readonly firmaModel: Model<Firma>,
    @InjectModel(Inmueble.name) private readonly inmuebleModel: Model<Inmueble>,
  ) {}

  /** Genera el enlace (token) de firma para un contrato redactado. */
  async crear(inmuebleId: string, dto: CrearFirmaDto) {
    if (!isValidObjectId(inmuebleId)) throw new NotFoundException('Inmueble no encontrado');
    const inmueble = await this.inmuebleModel.exists({ _id: inmuebleId });
    if (!inmueble) throw new NotFoundException('Inmueble no encontrado');

    const { modo, datos } = dto;
    const contraparte = modo === 'arriendo' ? datos.ate : datos.comp;
    if (!contraparte?.trim()) {
      throw new BadRequestException('Escribe el nombre de la contraparte');
    }

    const firma = await this.firmaModel.create({
      token: randomBytes(9).toString('base64url'),
      inmueble: inmuebleId,
      modo,
      datos,
    });
    return firma.toJSON();
  }

  async obtener(token: string) {
    const firma = await this.firmaModel.findOne({ token }).exec();
    if (!firma) throw new NotFoundException('Enlace de firma no válido o vencido');
    return firma.toJSON();
  }

  /** Firma el contrato y actualiza el inmueble (misma lógica del prototipo). */
  async firmar(token: string) {
    // Marcado atómico: evita que dos clics firmen el mismo contrato dos veces.
    const firma = await this.firmaModel
      .findOneAndUpdate(
        { token, firmada: false },
        { $set: { firmada: true, firmadaEn: new Date() } },
        { new: true },
      )
      .exec();

    if (!firma) {
      const existe = await this.firmaModel.exists({ token });
      if (!existe) throw new NotFoundException('Enlace de firma no válido o vencido');
      throw new ConflictException('Este contrato ya fue firmado');
    }

    const inmueble = await this.inmuebleModel.findById(firma.inmueble).exec();
    if (!inmueble) throw new NotFoundException('Inmueble no encontrado');

    const d = firma.datos;
    const fecha = hoyISO();
    const comunes = {
      valor: Number(d.val),
      dir: d.dir ?? inmueble.dir,
      barrio: d.bar ?? inmueble.barrio,
      lind: d.lin ?? inmueble.lind,
    };

    if (firma.modo === 'arriendo') {
      inmueble.contratos.forEach((c) => (c.vig = false));
      inmueble.contratos.unshift({
        vig: true,
        fecha,
        firm: [d.arr, d.ate, ...(d.cods ?? [])].filter((x): x is string => !!x?.trim()),
      });
      const vence = new Date();
      vence.setMonth(vence.getMonth() + Number(d.dur ?? 12));
      Object.assign(inmueble, comunes, {
        estado: 'Arrendada',
        venc: vence.toISOString().slice(0, 10),
        diaPago: Number(d.dia ?? 5),
      });
    } else {
      inmueble.contratos.unshift({
        vig: false,
        fecha,
        firm: [d.vend, d.comp].filter((x): x is string => !!x?.trim()),
      });
      Object.assign(inmueble, comunes, { estado: 'Vendida' });
    }

    await inmueble.save();
    return inmueble.toJSON();
  }
}
