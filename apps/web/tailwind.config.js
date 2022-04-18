module.exports = {
  purge: ['./src/pages/**/*.tsx', './src/components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['BCSans'],
    },
    extend: {
      colors: {
        bcBluePrimary: '#003366',
        bcYellowPrimary: '#FCBA19',
        bcBlack: '#313132',
        bcDeepBlack: '#272833',
        bcGray: '#606060',
        bcGrayLabel: '#574F5A',
        bcLightGray: '#F2F2F2',
        bcBlueLink: '#1A5A96',
        bcBlueNav: '#38598A',
        bcRedError: '#D8292F',
        bcGreenSuccess: '#2E8540',
        bcYellowWarning: '#F5A623',
        bcBlueAccent: '#38598A',
        bcBlueIndicator: '#0053A4',
        bcLightBackground: '#E5E5E5',
        bcLightBlueBackground: '#D9EAF7',
        bcOrange: '#F6A622',
        bcDisabled: '#CFCFCF',
      },
      fontSize: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      ringOffsetWidth: {
        10: '10px',
      },
      boxShadow: {
        xs: '0px 1px 0px rgba(0, 0, 0, 0.1)',
        '2xl': '0 4px 16px 0 rgba(35,64,117,0.3)',
      },
      minWidth: {
        5: '1.25rem',
      },
      width: {
        layout: '1140px',
        xl: '1215px',
      },
      letterSpacing: {
        widest: '.3em',
        wider: '.1em',
      },
      borderWidth: {
        10: '10px',
      },
      padding: {
        0.5: '2px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      backgroundColor: ['even'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
