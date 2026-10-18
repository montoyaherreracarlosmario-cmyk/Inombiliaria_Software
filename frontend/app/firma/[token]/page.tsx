import PaginaFirma from '@/components/PaginaFirma';

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <PaginaFirma token={token} />;
}
