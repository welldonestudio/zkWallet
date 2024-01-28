import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '@mysten/dapp-kit/dist/index.css';

import ApiProvider from '@/component/api';
import ThemeProvider from '@/component/theme/ThemeProvider';
import { wrapper } from '@/store/store';

import type { AppProps } from 'next/app';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
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
              <WalletProvider autoConnect>
                <ApiProvider>{<Component {...props} />}</ApiProvider>
              </WalletProvider>
            </PersistGate>
          </ThemeProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default wrapper.withRedux(App);
