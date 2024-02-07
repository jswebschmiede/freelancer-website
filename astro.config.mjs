import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind({
			applyBaseStyles: false
		}),
		sitemap()
	],
	compressHTML: false,
	output: 'static',
	build: {
		assets: '__assets'
	}
});
