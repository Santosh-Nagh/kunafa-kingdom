// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { OrderProvider } from '@/context/OrderContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OrderProvider>
      <Component {...pageProps} />
    </OrderProvider>
  );
}
