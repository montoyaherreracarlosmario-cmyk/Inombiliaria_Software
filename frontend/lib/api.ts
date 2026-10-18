import type { DatosContrato, Firma, Inmueble, Modo } from './types';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      cache: 'no-store',
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message) ? body.message.join('. ') : body?.message;
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  inmuebles: () => request<Inmueble[]>('/inmuebles'),
  inmueble: (id: string) => request<Inmueble>(`/inmuebles/${encodeURIComponent(id)}`),
  crearFirma: (id: string, modo: Modo, datos: DatosContrato) =>
    request<Firma>(`/inmuebles/${encodeURIComponent(id)}/firmas`, {
      method: 'POST',
      body: JSON.stringify({ modo, datos }),
    }),
  firma: (token: string) => request<Firma>(`/firmas/${encodeURIComponent(token)}`),
  firmar: (token: string) =>
    request<Inmueble>(`/firmas/${encodeURIComponent(token)}/firmar`, { method: 'POST' }),
};
