import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '@mysten/dapp-kit/dist/index.css';

import ApiProvider from '@/component/api';
import ThemeProvider from '@/component/theme/ThemeProvider';
import { wrapper } from '@/store/store';

import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  const store: any = useStore();

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        defaultNetwork="devnet"
        networks={{ devnet: { url: getFullnodeUrl('devnet') } }}
      >
        <ThemeProvider>
          <SnackbarProvider
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          />
          <PersistGate persistor={store.__persistor} loading={<></>}>
            <WalletProvider>
              <ApiProvider>{<Component {...pageProps} />}</ApiProvider>
            </WalletProvider>
          </PersistGate>
        </ThemeProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default wrapper.withRedux(App);
