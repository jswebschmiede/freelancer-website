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
