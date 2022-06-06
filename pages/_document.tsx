import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          defer
        ></script>

        <meta name="application-name" content="Calories Log" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Calories Log" />
        <meta name="description" content="Calories Log" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="twitter:card" content="Calories Log" />
        <meta name="twitter:url" content="https://calories-log.net" />
        <meta name="twitter:title" content="Calories Log" />
        <meta name="twitter:description" content="Calories Log" />
        <meta
          name="twitter:image"
          content="https://calories-log.net/icon.png"
        />
        <meta name="twitter:creator" content="@CreatiCoding" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Calories Log" />
        <meta property="og:description" content="Calories Log" />
        <meta property="og:site_name" content="Calories Log" />
        <meta property="og:url" content="https://calories-log.net" />
        <meta property="og:image" content="https://calories-log.net/icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
