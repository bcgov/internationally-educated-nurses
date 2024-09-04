import ReactSelect, { Props as ReactSelectProps } from 'react-select';
export * from 'react-select';

// Define a generic type for CustomReactSelect
export default function CustomReactSelect<TOption, TIsMulti extends boolean = false>(
  props: ReactSelectProps<TOption, TIsMulti>,
) {
  //   const nonce = 'nonce-1234567890';

  return (
    //  <NonceProvider cacheKey='css' nonce={nonce}>
    <ReactSelect {...props} />
    //  </NonceProvider>
  );
}
