'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { fechaLarga } from '@/lib/format';
import { useAsync } from '@/lib/useAsync';
import ContratoDocumento from './ContratoDocumento';
import { Cargando, ErrorCaja } from './Estado';
import { useToast } from './ToastProvider';

/** Página pública a la que llega quien recibe el link de firma. */
export default function PaginaFirma({ token }: { token: string }) {
  const toast = useToast();
  const { data: firma, error, loading, setData, reload } = useAsync(() => api.firma(token), [token]);
  const [ocupado, setOcupado] = useState(false);

  if (loading) return <Cargando />;
  if (error || !firma) return <ErrorCaja mensaje={error ?? 'Enlace no válido'} onReintentar={reload} />;

  const firmar = async () => {
    setOcupado(true);
    try {
      await api.firmar(token);
      setData({ ...firma, firmada: true, firmadaEn: new Date().toISOString() });
      toast('Contrato firmado. ¡Gracias!');
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="view">
      <div className="visor noprint">
        {firma.firmada ? <span className="tag Arrendada" style={{ margin: 0 }}>Firmado</span> : <span className="tag pulse" style={{ margin: 0 }}>Pendiente de firma</span>}
        📄 Contrato
      </div>
      <div className="hoja">
        <ContratoDocumento modo={firma.modo} datos={firma.datos} fecha={fechaLarga(new Date(firma.createdAt))} />
      </div>
      <div className="row noprint" style={{ justifyContent: 'center' }}>
        {!firma.firmada && (
          <button className="g" onClick={firmar} disabled={ocupado}>Firmar contrato</button>
        )}
        <button className="g" onClick={() => window.print()}>Descargar PDF</button>
      </div>
    </div>
  );
}
