'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { fechaLarga } from '@/lib/format';
import type { DatosContrato, Inmueble, Modo } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import ContratoDocumento from './ContratoDocumento';
import { Cargando, ErrorCaja } from './Estado';
import { useToast } from './ToastProvider';

type Estado = {
  arr: string; ate: string; vend: string; comp: string; ciu: string;
  dir: string; bar: string; lin: string; val: string; dur: string; dia: string; pago: string;
};

function Campo({ l, v, onChange, type = 'text', placeholder = '' }: {
  l: string; v: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <>
      <label>{l}</label>
      <input type={type} placeholder={placeholder} value={v} onChange={(e) => onChange(e.target.value)} />
    </>
  );
}

export default function ContratoForm({ id, modoForzado }: { id: string; modoForzado?: Modo }) {
  const { data: inmueble, error, loading, reload } = useAsync(() => api.inmueble(id), [id]);
  if (loading) return <Cargando />;
  if (error || !inmueble) return <ErrorCaja mensaje={error ?? 'Inmueble no encontrado'} onReintentar={reload} />;
  return <Formulario inmueble={inmueble} modoForzado={modoForzado} />;
}

function Formulario({ inmueble: cur, modoForzado }: { inmueble: Inmueble; modoForzado?: Modo }) {
  const router = useRouter();
  const toast = useToast();
  const [modo, setModo] = useState<Modo>(modoForzado ?? (cur.estado === 'Para la venta' ? 'venta' : 'arriendo'));
  const [cods, setCods] = useState<string[]>(['']);
  const [S, setS] = useState<Estado>({
    arr: 'Inmobiliaria', ate: '', vend: '', comp: '', ciu: 'Ibagué',
    dir: cur.dir, bar: cur.barrio, lin: cur.lind, val: String(cur.valor), dur: '12', dia: '5', pago: 'De contado',
  });
  const [fecha, setFecha] = useState('');
  const [enlace, setEnlace] = useState<{ token: string; url: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);

  // La fecha se calcula en el navegador para evitar diferencias servidor/cliente.
  useEffect(() => setFecha(fechaLarga()), []);

  const set = (k: keyof Estado) => (v: string) => {
    setS((s) => ({ ...s, [k]: v }));
    setEnlace(null); // si cambia el texto, el enlace anterior ya no corresponde
  };

  const datos = (): DatosContrato => ({
    arr: S.arr, ate: S.ate, vend: S.vend, comp: S.comp,
    cods: cods.map((c) => c.trim()).filter(Boolean),
    ciu: S.ciu, dir: S.dir, bar: S.bar, lin: S.lin,
    val: Number(S.val) || 0,
    dur: Math.round(Number(S.dur)) || 12,
    dia: Math.round(Number(S.dia)) || 5,
    pago: S.pago,
  });

  // Vista previa en vivo (los campos numéricos se muestran tal cual se escriben)
  const preview: DatosContrato = {
    ...datos(),
    dur: S.dur === '' ? undefined : Number(S.dur),
    dia: S.dia === '' ? undefined : Number(S.dia),
  };

  const enviar = async () => {
    if (!(modo === 'arriendo' ? S.ate.trim() : S.comp.trim())) return toast('Escribe el nombre de la contraparte');
    setOcupado(true);
    try {
      const f = await api.crearFirma(cur.id, modo, datos());
      setEnlace({ token: f.token, url: `${window.location.origin}/firma/${f.token}` });
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setOcupado(false);
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace!.url);
      toast('Link copiado');
    } catch {
      toast('No se pudo copiar; selecciónalo manualmente');
    }
  };

  const simularFirma = async () => {
    setOcupado(true);
    try {
      await api.firmar(enlace!.token);
      toast('Contrato firmado y guardado');
      router.push(`/inmuebles/${cur.id}`);
    } catch (e) {
      toast((e as Error).message);
      setOcupado(false);
    }
  };

  const linderos = (
    <>
      <label>Linderos</label>
      <textarea rows={3} value={S.lin} onChange={(e) => set('lin')(e.target.value)} />
    </>
  );

  return (
    <div className="view">
      <div className="noprint">
        <Link href={`/inmuebles/${cur.id}`} className="l" style={{ display: 'inline-block', padding: '10px 0', fontWeight: 600, color: 'var(--ac)', textDecoration: 'none' }}>
          ← Volver
        </Link>
      </div>
      <div className="grid">
        <div className="card noprint">
          <div className="modo">
            <button className={modo === 'arriendo' ? 'on' : ''} onClick={() => { setModo('arriendo'); setEnlace(null); }}>
              Arriendo
            </button>
            <button className={modo === 'venta' ? 'on' : ''} onClick={() => { setModo('venta'); setEnlace(null); }}>
              Compraventa
            </button>
          </div>
          {modo === 'arriendo' ? (
            <>
              <Campo l="Arrendador" v={S.arr} onChange={set('arr')} />
              <Campo l="Arrendatario" v={S.ate} onChange={set('ate')} placeholder="Ej: Pepito Perez" />
              <label>Coarrendatario / Codeudor</label>
              <div>
                {cods.map((c, k) => (
                  <input
                    key={k}
                    value={c}
                    placeholder={`Codeudor ${k + 1}`}
                    style={{ marginTop: 6 }}
                    onChange={(e) => { setCods((a) => a.map((x, j) => (j === k ? e.target.value : x))); setEnlace(null); }}
                  />
                ))}
              </div>
              <button className="g" style={{ marginTop: 10 }} onClick={() => setCods((a) => [...a, ''])}>
                + Agregar
              </button>
              <Campo l="Ciudad" v={S.ciu} onChange={set('ciu')} />
              <Campo l="Dirección del inmueble" v={S.dir} onChange={set('dir')} />
              <Campo l="Barrio" v={S.bar} onChange={set('bar')} />
              {linderos}
              <Campo l="Valor mensual" type="number" v={S.val} onChange={set('val')} />
              <Campo l="Duración (meses)" type="number" v={S.dur} onChange={set('dur')} />
              <Campo l="Día de pago de cada mes" type="number" v={S.dia} onChange={set('dia')} />
            </>
          ) : (
            <>
              <Campo l="Vendedor" v={S.vend} onChange={set('vend')} placeholder="Nombre completo" />
              <Campo l="Comprador" v={S.comp} onChange={set('comp')} placeholder="Nombre completo" />
              <Campo l="Ciudad" v={S.ciu} onChange={set('ciu')} />
              <Campo l="Dirección del inmueble" v={S.dir} onChange={set('dir')} />
              <Campo l="Barrio" v={S.bar} onChange={set('bar')} />
              {linderos}
              <Campo l="Precio de venta" type="number" v={S.val} onChange={set('val')} />
              <Campo l="Forma de pago" v={S.pago} onChange={set('pago')} />
            </>
          )}
        </div>

        <div>
          <div className="visor noprint">
            <span className="tag pulse" style={{ margin: 0 }}>En vivo</span> 📄 Vista previa del PDF
          </div>
          <div className="hoja" id="doc">
            <ContratoDocumento modo={modo} datos={preview} fecha={fecha} />
          </div>
          <div className="row noprint" style={{ justifyContent: 'center' }}>
            <button className="g" onClick={enviar} disabled={ocupado}>Enviar link para firma</button>
            <button className="g" onClick={() => window.print()}>Descargar PDF</button>
          </div>
          {enlace && (
            <div className="card view noprint">
              <b>Link de firma generado</b>
              <div className="link">{enlace.url}</div>
              <div className="row">
                <button onClick={copiar}>Copiar link</button>
                <button className="g" onClick={simularFirma} disabled={ocupado}>Simular firma</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
