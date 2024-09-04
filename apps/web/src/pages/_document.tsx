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
    const cspPolicy = `
                        default-src 'self' 
                          https://keycloak.freshworks.club 
                          https://common-logon-dev.hlth.gov.bc.ca 
                          https://common-logon-test.hlth.gov.bc.ca 
                          https://common-logon.hlth.gov.bc.ca 
                          https://ien-dev-reports.s3.ca-central-1.amazonaws.com 
                          https://ien-test-reports.s3.ca-central-1.amazonaws.com 
                          https://ien-prod-reports.s3.ca-central-1.amazonaws.com;
                        img-src 'self';
                        script-src 'self' 'nonce-${nonce}';
                        style-src 'self' 'nonce-${nonce}';
                        form-action 'self';
                        frame-ancestors 'self';
                      `;

    return (
      <Html>
        <Head>
          <meta httpEquiv='Content-Security-Policy' content={cspPolicy} />
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
