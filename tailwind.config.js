const { nextui } = require('@nextui-org/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/components/{accordion,divider,button,checkbox,card,dropdown,avatar,table,pagination,chip,user,modal,select,radio,tabs,tooltip,popover,badge,skeleton,progress,breadcrumbs,user}.js',
  ],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      fontFamily: {
        mono: ['var(--font-roboto-mono)'],
      },
      height: {
        900: '900px',
        477: '477px',
        100: '100px',
        400: '400px',
        600: '600px',
      },
      width: {
        150: '150px',
        200: '200px',
        300: '300px',
        400: '400px',
        500: '500px',
        800: '800px',
        900: '900px',
        1200: '1200px',
        1400: '1400px',
        1600: '1600px',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
  corePlugins: {
    position: true,
  },
}
