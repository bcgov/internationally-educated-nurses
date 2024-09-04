// _document.tsx in Next.js

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { NextApiRequest } from 'next';

interface MyDocumentProps extends DocumentInitialProps {
  nonce: string;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    // Type check for the 'x-nonce' header
    const nonceHeader = (ctx.req as NextApiRequest)?.headers['x-nonce'];
    const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader || ''; // Ensure nonce is a string

    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html>
        <Head>
          <meta
            httpEquiv='Content-Security-Policy'
            content={`default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self' 'nonce-${nonce}'`}
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
