import { Children } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { GoogleTagManager } from '@next/third-parties/google';
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
const IMAGE_FB = 'https://zkwallet.welldonestudio.io/seo/zkwallet-fb.png';
const IMAGE_X =
  'https://zkwallet.welldonestudio.io/seo/zkwallet-twitter-max.png';
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
          <meta property="og:site_name" content={'WELLDONE Studio zkWallet'} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={IMAGE_FB} />
          <meta property="og:image:type" content="image/png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@WelldoneStudio_" />
          <meta property="twitter:title" content={TITLE} />
          <meta property="twitter:description" content={DESC} />
          <meta property="twitter:image" content={IMAGE_X} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <GoogleTagManager gtmId="G-5QCR5JCBS4" />
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
