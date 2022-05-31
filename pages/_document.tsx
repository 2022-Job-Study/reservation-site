import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Make Your Reservation!</title>
          <meta charSet="utf-8"></meta>
          <body>
            <script
              defer
              src="https://developers.kakao.com/sdk/js/kakao.js"
            ></script>
            <Main />
            <NextScript />
          </body>
        </Head>
      </Html>
    );
  }
}
