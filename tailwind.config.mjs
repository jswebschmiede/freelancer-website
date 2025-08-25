/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: 'Poppins, sans-serif'
            },

            backgroundImage: {
                'grid-white':
                    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%27100%27 height=%27100%27 fill=%27none%27 stroke=%27rgb(255 255 255 / 0.02)%27%3e%3cpath d=%27M0 .5H31.5V32%27/%3e%3c/svg%3e")',
                'black-gradient': 'linear-gradient(90deg, #170d37,#06091f)'
            },

            animation: {
                'glow-pulse': 'glow-pulse 12s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'scale-in': 'scaleIn 0.5s ease-out'
            },

            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { transform: 'scale(1) translate(0px, 0px)' },
                    '33%': { transform: 'scale(1.1) translate(30px, -20px)' },
                    '66%': { transform: 'scale(0.9) translate(-20px, 20px)' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                scaleIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)'
                    }
                }
            }
        }
    },
    daisyui: {
        themes: [
            {
                synthwave: {
                    ...require('daisyui/src/theming/themes')['synthwave'],
                    '--rounded-btn': '5rem'
                }
            }
        ]
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('tailwind-scrollbar')({ nocompatible: true }),
        require('daisyui')
    ]
};
