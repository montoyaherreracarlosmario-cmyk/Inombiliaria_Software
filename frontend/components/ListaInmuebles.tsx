'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { clsEstado, fd, fmt, icono } from '@/lib/format';
import type { Tipo } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { Cargando, ErrorCaja } from './Estado';
import Tabs from './Tabs';

export default function ListaInmuebles() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tipo>(params.get('tipo') === 'Apartamento' ? 'Apartamento' : 'Casa');
  const { data, error, loading, reload } = useAsync(() => api.inmuebles(), []);

  if (loading) return <Cargando />;
  if (error || !data) return <ErrorCaja mensaje={error ?? 'Sin datos'} onReintentar={reload} />;

  const conteo: Record<Tipo, number> = {
    Casa: data.filter((i) => i.tipo === 'Casa').length,
    Apartamento: data.filter((i) => i.tipo === 'Apartamento').length,
  };

  const cambiar = (t: Tipo) => {
    if (t === tab) return;
    setTab(t);
    // Recuerda la pestaña en la URL (sin recargar) para el botón "Volver".
    window.history.replaceState(null, '', t === 'Casa' ? '/' : `/?tipo=${t}`);
  };

  return (
    <div className="view">
      <Tabs tab={tab} onChange={cambiar} conteo={conteo} />
      <div className="view" key={tab}>
        <h2>{tab === 'Casa' ? 'Casas' : 'Apartamentos'}</h2>
        {data
          .filter((i) => i.tipo === tab)
          .map((i, k) => (
            <Link
              key={i.id}
              href={`/inmuebles/${i.id}`}
              className="card item"
              style={{ animationDelay: `${k * 220}ms`, color: 'inherit', textDecoration: 'none' }}
            >
              <div className="thumb">{icono(i)}</div>
              <div className="info">
                <p>
                  <b>{i.nombre}</b>
                  <span className={`tag ${clsEstado(i.estado)}`}>{i.estado}</span>
                </p>
                {i.venc && (
                  <>
                    <p>Vencimiento contrato: {fd(i.venc)}</p>
                    <p>Fecha pago arriendo: {i.diaPago} de cada mes</p>
                  </>
                )}
                <p>Valor: {fmt(i.valor)}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
