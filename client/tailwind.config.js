/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#000080',
        'second-color': '#4169E1',
        'second-color-hover': '#7f9efa',
        'second-color-opa': '#4169e159',

        'white': '#fff',
        'gray-10': '#F7F9FD',
        'gray-20': '#D7E1F4',
        'gray-30': '#D7E1f4',
        'gray-40': '#A9BADA',
        'gray-50': '#869DCB',
        'gray-60': '#6882B6',
        'gray-70': '#4C689E',
        'gray-80': '#3C517C',
        'gray-90': '#2B3B5A',
        'gray-100': '#1B2437',
        'gray-100-opa': 'rgba(27, 36, 55, 0.7)',
        
        'error': '#EE5D50',
        'success': '#2DAE32',
        'warning': '#FFB547',

        'color-2': '#3C517C',
        'color-3': '#A9BADA',
        'color-4': '#6882B6',

        'black-1': "#1C1C1C1A",

        'custom-gradient': 'linear-gradient(to bottom, rgba(215, 225, 244, 0) 0%, #D7E1F4 100%)',
        'gradient-2': 'linear-gradient(to right, #4169E1 100%, #000080 100%)',
      },
      screens: {
        'medium-pc' : {'max': '1300px'},
        'small-pc': {'max': '950px'},
        'tablet': {'max': '700px'},
        'phone': {'max': '500px'},
        'small-phone': {'max': '450px'},
      },
      boxShadow: {
        'shadow': '3px 10px 8px 7px rgb(229, 239, 249)',
        'shadow2': '0px 0px 7px 1px rgba(0,0,0,0.75)'
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['focus', 'peer-focus'],
      borderWidth: ['focus', 'peer-focus'],
    },
  },
  plugins: [],
};