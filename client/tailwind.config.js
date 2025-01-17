/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens:{
            'moblieSm': "320px",
            'moblieLg': "425px",
            'xsm': "460px",
            'sm':"640px",
            'md': "768px",
            'lg': "1025px",
            'xl': "1281px",
            '2xl': "1536px",
        },

        colors: {
            'white': '#FFFFFF',
            'black': '#000000',
            'grey': '#F3F3F3',
            'dark-grey': '#6B6B6B',
            'red': '#ff005e',
            'transparent': 'transparent',
            'twitter': '#1DA1F2',
            'purple': '#8B46FF'
        },

        fontSize: {
            'sm': '12px',
            'base': '14px',
            'xl': '16px',
            '2xl': '20px',
            '3xl': '28px',
            '4xl': '38px',
            '5xl': '50px',
        },

        extend: {
            fontFamily: {
              messinaReg: ["Whyte", "sans-serif"],
              candela: ["Whyte Inktrap", "serif"]
            },
        },

    },
    plugins: [
        
    ],
};