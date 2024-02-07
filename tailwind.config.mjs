/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: 'Poppins, sans-serif'
			}
		}
	},
	daisyui: {
		themes: ['night']
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('daisyui')
	]
};