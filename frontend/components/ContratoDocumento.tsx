import type { DatosContrato, Modo } from '@/lib/types';
import { fmt } from '@/lib/format';

/** Dato resaltado, o línea en blanco si está vacío. */
function Bv({ x, d = '__________' }: { x?: string | number | null; d?: string }) {
  return x !== undefined && x !== null && String(x).trim() ? <b>{x}</b> : <b className="bl">{d}</b>;
}

interface Props {
  modo: Modo;
  datos: DatosContrato;
  fecha: string;
}

/** Texto del contrato (vista previa en vivo, impresión y página de firma). */
export default function ContratoDocumento({ modo, datos: S, fecha: f }: Props) {
  const cs = (S.cods ?? []).filter(Boolean);
  const inm = (
    <>
      <Bv x={S.dir} />, barrio <Bv x={S.bar} />, de la ciudad de <Bv x={S.ciu} />, cuyos linderos son:{' '}
      <Bv x={S.lin} d="____________________" />
    </>
  );
  const valor = S.val ? fmt(S.val) : '';

  if (modo === 'arriendo') {
    return (
      <>
        <h3>CONTRATO DE ARRENDAMIENTO DE VIVIENDA URBANA</h3>
        <p>
          En <Bv x={S.ciu} />, a {f}, entre <b>{S.arr || 'EL ARRENDADOR'}</b>, en adelante EL ARRENDADOR, y{' '}
          <Bv x={S.ate} d="EL ARRENDATARIO" />, en adelante EL ARRENDATARIO
          {cs.length > 0 && (
            <>
              , con la coarrendación/codeudoría de{' '}
              {cs.map((c, k) => (
                <span key={k}>
                  {k > 0 && ', '}
                  <b>{c}</b>
                </span>
              ))}
            </>
          )}
          , se celebra el presente contrato, regido por las siguientes cláusulas:
        </p>
        <p>
          <b>PRIMERA – Objeto.</b> EL ARRENDADOR entrega a título de arrendamiento el inmueble ubicado en {inm}.
        </p>
        <p>
          <b>SEGUNDA – Canon.</b> El canon mensual es de <Bv x={valor} />, pagadero dentro de los primeros{' '}
          <Bv x={S.dia} d="__" /> días de cada mes.
        </p>
        <p>
          <b>TERCERA – Duración.</b> El contrato tendrá una duración de <Bv x={S.dur} d="__" /> meses, contados desde
          la fecha de firma, prorrogable por acuerdo escrito de las partes.
        </p>
        <p>
          <b>CUARTA – Destinación.</b> El inmueble se destinará exclusivamente a vivienda. No podrá subarrendarse ni
          cederse el contrato sin autorización escrita del ARRENDADOR.
        </p>
        <p>
          <b>QUINTA – Servicios y reparaciones.</b> Los servicios públicos y las reparaciones locativas estarán a cargo
          del ARRENDATARIO.
        </p>
        <p>
          <b>SEXTA – Restitución.</b> Al terminar el contrato, EL ARRENDATARIO restituirá el inmueble en el estado en
          que lo recibió, salvo el desgaste natural.
        </p>
        <p>
          <b>SÉPTIMA – Terminación.</b> El incumplimiento de cualquier obligación faculta a la parte cumplida para dar
          por terminado el contrato conforme a la ley.
        </p>
        <p>Para constancia, se firma en dos ejemplares del mismo tenor.</p>
        <div className="sig">
          <div>
            {S.arr || 'Arrendador'}
            <br />
            <small>Arrendador</small>
          </div>
          <div>
            {S.ate || 'Arrendatario'}
            <br />
            <small>Arrendatario</small>
          </div>
          {cs.map((c, k) => (
            <div key={k}>
              {c}
              <br />
              <small>Codeudor</small>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <h3>CONTRATO DE COMPRAVENTA DE INMUEBLE</h3>
      <p>
        En <Bv x={S.ciu} />, a {f}, entre <Bv x={S.vend} d="EL VENDEDOR" />, en adelante EL VENDEDOR, y{' '}
        <Bv x={S.comp} d="EL COMPRADOR" />, en adelante EL COMPRADOR, se celebra el presente contrato de compraventa:
      </p>
      <p>
        <b>PRIMERA – Objeto.</b> EL VENDEDOR transfiere a título de venta el inmueble ubicado en {inm}.
      </p>
      <p>
        <b>SEGUNDA – Precio.</b> El precio de la venta es de <Bv x={valor} />.
      </p>
      <p>
        <b>TERCERA – Forma de pago.</b> EL COMPRADOR pagará el precio así: <Bv x={S.pago} d="____________" />.
      </p>
      <p>
        <b>CUARTA – Tradición y libertad.</b> EL VENDEDOR garantiza que el inmueble es de su propiedad y se encuentra
        libre de gravámenes, embargos y limitaciones de dominio.
      </p>
      <p>
        <b>QUINTA – Entrega.</b> El inmueble se entregará a paz y salvo por impuestos y servicios públicos a la fecha
        de la escritura pública.
      </p>
      <p>
        <b>SEXTA – Gastos.</b> Los gastos notariales y de registro serán asumidos por las partes en la proporción que
        la ley establece.
      </p>
      <p>Para constancia, se firma en dos ejemplares del mismo tenor.</p>
      <div className="sig">
        <div>
          {S.vend || 'Vendedor'}
          <br />
          <small>Vendedor</small>
        </div>
        <div>
          {S.comp || 'Comprador'}
          <br />
          <small>Comprador</small>
        </div>
      </div>
    </>
  );
}
