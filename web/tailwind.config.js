/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      margin: {
        menu: '2vh',
      },
      padding: {
        menuPadding: '.7rem',
      },
      width: {
        menuWidth: '45vh',
      },
      height: {
        headerHeight: '10vh',
        sidepanelHeight: '14vh',
        itemHeight: '4vh',
      },
      minHeight: {
        itemheight: '4vh',
      },
      backgroundColor: {
        subHeader: 'rgb(0, 0, 0)',
      },
      colors: {
        subheader: '#2c73c5',
        selected: 'black',
      },
      fontSize: {
        header: '5.5vh',
        normal: '1.7vh',
      },
      letterSpacing: {
        menu: '0.02vh',
      },
    },
  },
  plugins: [],
};
