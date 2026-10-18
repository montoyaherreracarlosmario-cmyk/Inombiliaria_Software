// Habitaciones, baños y área de un inmueble
export default function Caract({ i }) {
  const v = (x, u = '') => (x === undefined || x === null || x === '' ? '—' : `${x}${u}`);
  return (
    <p className="caract">
      <span>🛏️ {v(i.habitaciones)} hab.</span>
      <span>🛁 {v(i.banos)} baños</span>
      <span>📐 {v(i.area, ' m²')}</span>
    </p>
  );
}
