import Head from "next/head";
import '../styles/globals.css'; 
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // ✅ Verificar si la URL actual (no el pathname) es de base de conocimientos
  const isBaseConocimientosRoute = router.asPath.startsWith('/base-conocimientos');
  
  if (isBaseConocimientosRoute) {
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" sizes="76x76" type="image/png" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon.png" />
          {/* 🆕 Font Awesome CSS */}
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <title>Base de Conocimientos</title>
        </Head>
        <Component {...pageProps} />
      </>
    );
  }

  // Para otras rutas que no sean base-conocimientos
  return <Component {...pageProps} />;
}

export default MyApp;