import Caract from './Caract';
import { fd, fmt, cls, icono, porVencer } from '../lib/utils';

const Pdf = ({ c }) => (
  <div className="pdf"><div className="thumb">PDF</div>
    <div><div>{c.tipo} · Fecha de firma: {fd(c.fecha)}</div><div style={{ color: 'var(--mut)' }}>Firmantes: {c.firm.join(', ')}</div></div>
  </div>
);

export default function Detalle({ inm: i, volver, crear }) {
  const vig = i.contratos.find((c) => c.vig);
  const ven = i.contratos.filter((c) => !c.vig);
  return (
    <div className="view">
      <button className="l" onClick={volver}>← Volver a {i.tipo === 'Casa' ? 'casas' : 'apartamentos'}</button>
      <div className="card">
        <div className="hero">🧑 {icono(i)}</div>
        <div className="info">
          <p><b>{i.nombre}</b><span className={`tag ${cls(i.estado)}`}>{i.estado}</span></p>
          <p>{i.dir} · {i.barrio}</p>
          <Caract i={i} />
          {i.venc && <><p>Vencimiento contrato: {fd(i.venc)}</p><p>Fecha pago arriendo: {i.diaPago} de cada mes</p></>}
          <p>Valor: {fmt(i.valor)}</p>
        </div>
        {i.estado !== 'Arrendada' && (
          <div className="row">
            <button onClick={() => crear(i.estado === 'Para la venta' ? 'venta' : 'arriendo')}>Crear contrato</button>
            <button onClick={() => crear('venta')}>Descargar formato compraventa</button>
          </div>
        )}
        {vig && <>
          <h3>Contrato vigente</h3><Pdf c={vig} />
          <div className="row">{porVencer(i) && <span className="tag pulse">Por vencer</span>}<button className="o" onClick={() => crear('arriendo')}>Renovar contrato</button></div>
        </>}
        <h3>Contratos vencidos</h3>
        {ven.length ? ven.map((c, k) => <Pdf key={k} c={c} />) : <p style={{ color: 'var(--mut)' }}>Sin contratos vencidos.</p>}
      </div>
    </div>
  );
}
