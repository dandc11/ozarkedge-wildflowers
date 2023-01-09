/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
    theme: {
        extend: {
            aspectRatio: {
                '4/3': '4 / 3',
            },
        },
        fontFamily: {
            display: ['Playfair Display', 'serif'],
            body: [
                'PT Sans',
                '-apple-system',
                'Roboto',
                'Oxygen',
                'Ubuntu',
                'Cantarell',
                'Fira Sans',
                'Droid Sans',
                'Helvetica Neue',
                'sans-serif',
            ],
            mono: ['ui-monospace', 'SFMono-Regular'],
        },
        screens: {
            'bp-400': '400px',
            'bp-500': '500px',
            'bp-600': '600px',
            'bp-700': '700px',
            'bp-800': '800px',
            'bp-900': '900px',
            'bp-1000': '1000px',
            'bp-1100': '1100px',
            'bp-1200': '1200px',
            'bp-1400': '1400px',
            'bp-1600': '1600px',
        },
    },
    plugins: [],
};
