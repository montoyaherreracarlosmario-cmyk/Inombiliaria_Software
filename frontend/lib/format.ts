import type { Inmueble } from './types';

export const fmt = (n: number | string) => '$ ' + Number(n).toLocaleString('es-CO');

export const fd = (s?: string | null) =>
  s ? new Date(s.length === 10 ? s + 'T00:00:00' : s).toLocaleDateString('es-CO') : '—';

export const fechaLarga = (d: Date = new Date()) =>
  d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

/** Vence en 90 días o menos */
export const porVencer = (i: Inmueble) =>
  !!i.venc && (new Date(i.venc).getTime() - Date.now()) / 864e5 <= 90;

export const clsEstado = (e: string) =>
  e === 'Arrendada' ? 'Arrendada' : e === 'Para la venta' ? 'Venta' : '';

export const icono = (i: Inmueble) => (i.tipo === 'Casa' ? '🏠' : '🏢');
