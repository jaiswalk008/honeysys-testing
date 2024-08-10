/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mine-shaft': '#313131',
        'silver-chalice': '#ADADAD',
        'dove-gray': '#616161',
        'cornflower-blue': '#506FF3',
        gray: '#919191',
        curious_blue: '#2F99C1',
        alabaster: '#FAFAFA',
        royal_blue: '#3459DF',
        mercury: '#EAEAEA',
        blizzard_blue: '#A7D9EC',
        atlantis: '#9BC530',
      },
      fontFamily: {
        Poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
