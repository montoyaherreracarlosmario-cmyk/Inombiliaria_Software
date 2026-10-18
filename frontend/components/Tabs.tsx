'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import type { Tipo } from '@/lib/types';

interface Props {
  tab: Tipo;
  onChange: (t: Tipo) => void;
  conteo: Record<Tipo, number>;
}

/** Pestañas con el óvalo animado que se desliza hacia la pestaña activa. */
export default function Tabs({ tab, onChange, conteo }: Props) {
  const btns = useRef<Partial<Record<Tipo, HTMLButtonElement | null>>>({});
  const [pill, setPill] = useState({ width: 0, x: 0 });
  const [anim, setAnim] = useState(false);

  useLayoutEffect(() => {
    const medir = () => {
      const b = btns.current[tab];
      if (b) setPill({ width: b.offsetWidth, x: b.offsetLeft });
    };
    medir();
    window.addEventListener('resize', medir);
    // Primera medición sin animación; las siguientes sí.
    const id = requestAnimationFrame(() => setAnim(true));
    return () => {
      window.removeEventListener('resize', medir);
      cancelAnimationFrame(id);
    };
  }, [tab, conteo.Casa, conteo.Apartamento]);

  const item = (t: Tipo, texto: string) => (
    <button
      ref={(el) => {
        btns.current[t] = el;
      }}
      className={tab === t ? 'on' : ''}
      aria-pressed={tab === t}
      onClick={() => onChange(t)}
    >
      {texto} ({conteo[t]})
    </button>
  );

  return (
    <div className="tabs">
      <span
        className="pill"
        style={{
          width: pill.width,
          transform: `translateX(${pill.x}px)`,
          transition: anim ? undefined : 'none',
        }}
      />
      {item('Casa', '🏠 Casas')}
      {item('Apartamento', '🏢 Apartamentos')}
    </div>
  );
}
