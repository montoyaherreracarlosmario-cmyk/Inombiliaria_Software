import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const TIPOS = ['Casa', 'Apartamento'] as const;
export const ESTADOS = ['Arrendada', 'Sin arrendar', 'Para la venta', 'Vendida'] as const;
export type Tipo = (typeof TIPOS)[number];
export type Estado = (typeof ESTADOS)[number];

@Schema({ _id: false })
export class Contrato {
  /** true = contrato vigente */
  @Prop({ required: true, default: false })
  vig: boolean;

  /** Fecha de firma, formato YYYY-MM-DD */
  @Prop({ required: true })
  fecha: string;

  @Prop({ type: [String], default: [] })
  firm: string[];
}
export const ContratoSchema = SchemaFactory.createForClass(Contrato);

@Schema({ timestamps: true })
export class Inmueble {
  @Prop({ required: true, enum: TIPOS, index: true })
  tipo: Tipo;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, enum: ESTADOS })
  estado: Estado;

  /** Vencimiento del contrato vigente, YYYY-MM-DD (vacío si no aplica) */
  @Prop({ default: '' })
  venc: string;

  @Prop({ type: Number, default: null })
  diaPago: number | null;

  @Prop({ required: true })
  valor: number;

  @Prop({ default: '' })
  dir: string;

  @Prop({ default: '' })
  barrio: string;

  @Prop({ default: '' })
  lind: string;

  @Prop({ type: [ContratoSchema], default: [] })
  contratos: Contrato[];
}

export type InmuebleDocument = HydratedDocument<Inmueble>;
export const InmuebleSchema = SchemaFactory.createForClass(Inmueble);

// Se expone `id` (string) en lugar de `_id` / `__v`.
InmuebleSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});
