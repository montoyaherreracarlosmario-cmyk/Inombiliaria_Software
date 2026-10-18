import './globals.css';

export const metadata = { title: 'Habitat Capital', description: 'Gestión de inmuebles y contratos' };

export default function RootLayout({ children }) {
  return (<html lang="es"><body>{children}</body></html>);
}
