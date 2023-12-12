import { SnackbarProvider } from 'notistack';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import ApiProvider from '@/component/api';
import ThemeProvider from '@/component/theme/ThemeProvider';
import { wrapper } from '@/store/store';

import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  const store: any = useStore();

  return (
    <ThemeProvider>
      <SnackbarProvider
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      />
      <PersistGate persistor={store.__persistor} loading={<></>}>
        <ApiProvider>{<Component {...pageProps} />}</ApiProvider>
      </PersistGate>
    </ThemeProvider>
  );
}

export default wrapper.withRedux(App);
