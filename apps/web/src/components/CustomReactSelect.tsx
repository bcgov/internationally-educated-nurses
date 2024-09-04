import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import ReactSelect from 'react-select';
import crypto from 'crypto';
export * from 'react-select';

export default function CustomReactSelect(props: any) {
  const nonce = crypto.randomBytes(16).toString('base64');
  const cache = createCache({ key: 'css', prepend: true, nonce });
  return (
    <CacheProvider value={cache}>
      <ReactSelect {...props} />
    </CacheProvider>
  );
}
