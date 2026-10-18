'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/** Cabecera que se oculta al bajar y reaparece al subir. */
export default function Header() {
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    let ultimo = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > ultimo && y > 80) setOculto(true);
      else if (y < ultimo) setOculto(false);
      ultimo = Math.max(y, 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header id="cab" className={oculto ? 'oculto' : ''}>
      <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        <h1>🏠 Habitat Capital</h1>
        <p>Casas y apartamentos en un solo lugar</p>
      </Link>
    </header>
  );
}
