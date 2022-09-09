import { isoCountries } from './constants';

// convert alpha 2 code for countries to full name
export const convertCountryCode = (code: string | undefined) => {
  if (!code || !isoCountries[code as keyof typeof isoCountries]) {
    return 'N/A';
  }

  const { name } = isoCountries[code as keyof typeof isoCountries];
  return name;
};
