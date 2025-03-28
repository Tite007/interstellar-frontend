const { heroui } = require('@heroui/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/components/{accordion,date-picker,divider,button,date-picker,checkbox,card,dropdown,avatar,table,pagination,chip,user,modal,select,radio,tabs,tooltip,popover,badge,skeleton,progress,breadcrumbs,user,link}.js',
  ],
  theme: {
    extend: {
      colors: {
        lightGray: '#f0f4f8',
        dedede: '#dedede',
        D9D9D9: '#D9D9D9',
        F2F2F2: '#F2F2F2',
        F5F5F7: '#F5F5F7',
        redBranding: '#fe4349',
        softGreen: '#15BFA0',
        softRed: '#F29199',
        DCF230: '#DCF230',
        F2D230: '#F2D230',
        fc6c74: '#fc6c74',
      },
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
        230: '230px',
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
  plugins: [heroui()],
  corePlugins: {
    position: true,
  },
}
