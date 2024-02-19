import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind({
			nesting: true,
			applyBaseStyles: false
		}),
		sitemap(),
		icon()
	],
	compressHTML: false,
	output: 'static',
	build: {
		assets: '__assets'
	}
});
