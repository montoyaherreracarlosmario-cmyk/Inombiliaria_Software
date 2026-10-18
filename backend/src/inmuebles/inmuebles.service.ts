import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Inmueble, InmuebleDocument, Tipo } from './schemas/inmueble.schema';

@Injectable()
export class InmueblesService {
  constructor(@InjectModel(Inmueble.name) private readonly model: Model<Inmueble>) {}

  findAll(tipo?: Tipo) {
    return this.model
      .find(tipo ? { tipo } : {})
      .sort({ createdAt: 1, _id: 1 })
      .exec();
  }

  async findOne(id: string): Promise<InmuebleDocument> {
    if (!isValidObjectId(id)) throw new NotFoundException('Inmueble no encontrado');
    const inmueble = await this.model.findById(id).exec();
    if (!inmueble) throw new NotFoundException('Inmueble no encontrado');
    return inmueble;
  }
}
