import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';
// import crypto from 'crypto';
export * from 'react-select';

// Define a generic type for CustomReactSelect
export default function CustomReactSelect<TOption, TIsMulti extends boolean = false>(
  props: ReactSelectProps<TOption, TIsMulti>,
) {
  // Generate a nonce for CSP
  //   const nonce = crypto.randomBytes(16).toString('base64');
  const nonce = 'nonce-1234567890';

  // Create Emotion cache with the generated nonce
  const cache = createCache({ key: 'css', prepend: true, nonce });

  return (
    <CacheProvider value={cache}>
      <ReactSelect {...props} />
    </CacheProvider>
  );
}
