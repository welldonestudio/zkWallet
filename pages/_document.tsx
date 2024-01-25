import { Children } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import type { EmotionCache } from '@emotion/react';
import type { RenderPageResult } from 'next/dist/shared/lib/utils';
import type { DocumentInitialProps } from 'next/document';

const getCache = (): EmotionCache => {
  const cache = createCache({ key: 'css', prepend: true });
  cache.compat = true;
  return cache;
};

const TITLE = 'WELLDONE zkWallet';
const DESC =
  'Revolutionizing Web3 access for billions with unmatched ease and security, making blockchain more accessible and user-friendly.';
const IMAGE = 'https://docs.welldonestudio.io/img/seo/discord_fb.png';
const URL = 'https://zkwallet.welldonestudio.io/';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#131417" />

          <meta name="title" content={TITLE} />
          <meta name="description" content={DESC} />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:description" content={DESC} />
          <meta property="og:url" content={URL} />
          <meta property="og:image" content={IMAGE} />
          <meta name="twitter:card" content="summary" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx): Promise<DocumentInitialProps> => {
  const originalRenderPage = ctx.renderPage;

  const cache = getCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> => {
    return originalRenderPage({
      enhanceComponent: (Component) => {
        return (props): JSX.Element => {
          return (
            <CacheProvider value={cache}>
              <Component {...props} />
            </CacheProvider>
          );
        };
      },
    });
  };

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => {
    return (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    );
  });

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};
