import Head from "next/head";
import '../styles/globals.css'; 
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/png" href="/knowledge/logoAsturiano.png" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <title>Base de Conocimientos</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;