'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { clsEstado, fd, fmt, icono, porVencer } from '@/lib/format';
import type { Contrato } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { Cargando, ErrorCaja } from './Estado';

function Pdf({ c }: { c: Contrato }) {
  return (
    <div className="pdf">
      <div className="thumb">PDF</div>
      <div>
        <div>Fecha de firma: {fd(c.fecha)}</div>
        <div style={{ color: 'var(--mut)' }}>Firmantes: {c.firm.join(', ')}</div>
      </div>
    </div>
  );
}

export default function DetalleInmueble({ id }: { id: string }) {
  const { data: i, error, loading, reload } = useAsync(() => api.inmueble(id), [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) return <Cargando />;
  if (error || !i) return <ErrorCaja mensaje={error ?? 'Inmueble no encontrado'} onReintentar={reload} />;

  const vig = i.contratos.find((c) => c.vig);
  const ven = i.contratos.filter((c) => !c.vig);
  const volver = i.tipo === 'Casa' ? '/' : '/?tipo=Apartamento';

  return (
    <div className="view">
      <Link href={volver} className="l" style={{ display: 'inline-block', padding: '10px 0', fontWeight: 600, color: 'var(--ac)', textDecoration: 'none' }}>
        ← Volver a {i.tipo === 'Casa' ? 'casas' : 'apartamentos'}
      </Link>
      <div className="card">
        <div className="hero">🧑 {icono(i)}</div>
        <div className="info">
          <p>
            <b>{i.nombre}</b>
            <span className={`tag ${clsEstado(i.estado)}`}>{i.estado}</span>
          </p>
          <p>
            {i.dir} · {i.barrio}
          </p>
          {i.venc && (
            <>
              <p>Vencimiento contrato: {fd(i.venc)}</p>
              <p>Fecha pago arriendo: {i.diaPago} de cada mes</p>
            </>
          )}
          <p>Valor: {fmt(i.valor)}</p>
        </div>

        {i.estado !== 'Arrendada' && (
          <div className="row">
            <Link href={`/inmuebles/${i.id}/contrato`}>
              <button>Crear contrato</button>
            </Link>
            <Link href={`/inmuebles/${i.id}/contrato?modo=venta`}>
              <button>Descargar formato compraventa</button>
            </Link>
          </div>
        )}

        {vig && (
          <>
            <h3>Contrato vigente</h3>
            <Pdf c={vig} />
            <div className="row">
              {porVencer(i) && <span className="tag pulse">Por vencer</span>}
              <Link href={`/inmuebles/${i.id}/contrato?modo=arriendo`}>
                <button className="o">Renovar contrato</button>
              </Link>
            </div>
          </>
        )}

        <h3>Contratos vencidos</h3>
        {ven.length ? (
          ven.map((c, k) => <Pdf key={k} c={c} />)
        ) : (
          <p style={{ color: 'var(--mut)' }}>Sin contratos vencidos.</p>
        )}
      </div>
    </div>
  );
}
