import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ModoContrato = 'arriendo' | 'venta';

/** Solicitud de firma: guarda el contrato redactado hasta que se firma. */
@Schema({ timestamps: true })
export class Firma {
  @Prop({ required: true, unique: true, index: true })
  token: string;

  @Prop({ type: Types.ObjectId, ref: 'Inmueble', required: true })
  inmueble: Types.ObjectId;

  @Prop({ required: true, enum: ['arriendo', 'venta'] })
  modo: ModoContrato;

  /** Datos del formulario del contrato */
  @Prop({ type: Object, required: true })
  datos: Record<string, any>;

  @Prop({ default: false })
  firmada: boolean;

  @Prop({ type: Date, default: null })
  firmadaEn: Date | null;
}

export type FirmaDocument = HydratedDocument<Firma>;
export const FirmaSchema = SchemaFactory.createForClass(Firma);

// Las solicitudes sin firmar caducan a los 60 días.
FirmaSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 60 });

FirmaSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = String(ret._id);
    ret.inmueble = String(ret.inmueble);
    delete ret._id;
    delete ret.updatedAt;
    return ret;
  },
});
