// eslint-disable-next-line @typescript-eslint/no-var-requires
const color = require('tailwindcss/colors')

module.exports = {
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: color.blue,
                yellow: color.yellow,
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            opacity: ['disabled'],
        },
    },
    plugins: [],
}
