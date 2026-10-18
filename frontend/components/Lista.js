import { fd, fmt, cls, icono, filtrar } from '../lib/utils';
import Filtros from './Filtros';
import Caract from './Caract';

export default function Lista({ data, tab, setTab, abrir, filtros, setFiltros, nuevo }) {
  const base = filtrar(data, filtros);
  const n = (t) => base.filter((i) => i.tipo === t).length;
  const items = base.filter((i) => i.tipo === tab);
  const idx = tab === 'Casa' ? 0 : 1;
  return (
    <div className="view">
      <div className="tabs">
        <span className="pill" style={{ transform: `translateX(${idx * 100}%)` }} />
        <button className={idx === 0 ? 'on' : ''} onClick={() => setTab('Casa')}>🏠 Casas ({n('Casa')})</button>
        <button className={idx === 1 ? 'on' : ''} onClick={() => setTab('Apartamento')}>🏢 Apartamentos ({n('Apartamento')})</button>
      </div>
      <Filtros f={filtros} setF={setFiltros} total={data.length} mostrados={base.length} />
      <div className="toolbar">
        <h2>{tab === 'Casa' ? 'Casas' : 'Apartamentos'}</h2>
        <button className="g" onClick={nuevo}>＋ Agregar inmueble</button>
      </div>
      {items.length === 0 && <div className="card vacio">Ningún inmueble coincide con los filtros. Prueba ampliar los rangos o cambiar de pestaña.</div>}
      {items.map((i, k) => (
        <div key={i._id} className="card item" style={{ animationDelay: `${k * 220}ms` }} onClick={() => abrir(i._id)}>
          <div className="thumb">{icono(i)}</div>
          <div className="info">
            <p><b>{i.nombre}</b><span className={`tag ${cls(i.estado)}`}>{i.estado}</span></p>
            <Caract i={i} />
            {i.venc && <><p>Vencimiento contrato: {fd(i.venc)}</p><p>Fecha pago arriendo: {i.diaPago} de cada mes</p></>}
            <p>Valor: {fmt(i.valor)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
