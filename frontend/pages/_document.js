import Document, { Html, Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class MyDocument extends Document {
  // Added for google Analytics
  setGoogleTags() {
    if (publicRuntimeConfig.PRODUCTION) {
      return {
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());     
        gtag('config', 'UA-178240985-1');
        `
      };
    }
  }

   render() {
    return (
      <Html lang="en">
        <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet"/>
        {/* Added for google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-178240985-1"></script>
        <script dangerouslySetInnerHTML={this.setGoogleTags()} />
        {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" rel="stylesheet"/> */}
        {/* <link ref="stylesheet" href="/public/static/css/styles.css"/> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;