'use client';
import { useEffect, useState } from 'react';

/** Mensajes de carga y error. Avisa si el servidor (plan gratis) tarda en despertar. */
export function Cargando() {
  const [lento, setLento] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLento(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="card view" role="status">
      <b>Cargando…</b>
      {lento && (
        <p style={{ color: 'var(--mut)', margin: '8px 0 0' }}>
          El servidor estaba en reposo y está despertando; puede tardar hasta un minuto.
        </p>
      )}
    </div>
  );
}

export function ErrorCaja({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <div className="card view" role="alert">
      <b>No se pudo cargar</b>
      <p style={{ color: 'var(--mut)' }}>{mensaje}</p>
      {onReintentar && (
        <button className="o" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
