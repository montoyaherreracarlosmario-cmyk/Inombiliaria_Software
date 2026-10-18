import { Suspense } from 'react';
import ListaInmuebles from '@/components/ListaInmuebles';
import { Cargando } from '@/components/Estado';

export default function Home() {
  return (
    <Suspense fallback={<Cargando />}>
      <ListaInmuebles />
    </Suspense>
  );
}
