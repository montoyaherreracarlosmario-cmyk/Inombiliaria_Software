import ContratoForm from '@/components/ContratoForm';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ modo?: string }>;
}) {
  const { id } = await params;
  const { modo } = await searchParams;
  const forzado = modo === 'venta' || modo === 'arriendo' ? modo : undefined;
  return <ContratoForm id={id} modoForzado={forzado} />;
}
