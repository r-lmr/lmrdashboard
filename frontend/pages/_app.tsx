import React from 'react';
import '../styles/all.scss';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default App;
