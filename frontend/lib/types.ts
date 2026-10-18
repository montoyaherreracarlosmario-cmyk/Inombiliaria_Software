export type Tipo = 'Casa' | 'Apartamento';
export type Estado = 'Arrendada' | 'Sin arrendar' | 'Para la venta' | 'Vendida';
export type Modo = 'arriendo' | 'venta';

export interface Contrato {
  vig: boolean;
  fecha: string;
  firm: string[];
}

export interface Inmueble {
  id: string;
  tipo: Tipo;
  nombre: string;
  estado: Estado;
  venc: string;
  diaPago: number | null;
  valor: number;
  dir: string;
  barrio: string;
  lind: string;
  contratos: Contrato[];
}

/** Datos del formulario de contrato tal como los guarda la API */
export interface DatosContrato {
  arr?: string;
  ate?: string;
  vend?: string;
  comp?: string;
  cods?: string[];
  ciu?: string;
  dir?: string;
  bar?: string;
  lin?: string;
  val: number;
  dur?: number;
  dia?: number;
  pago?: string;
}

export interface Firma {
  id: string;
  token: string;
  inmueble: string;
  modo: Modo;
  datos: DatosContrato;
  firmada: boolean;
  firmadaEn: string | null;
  createdAt: string;
}
