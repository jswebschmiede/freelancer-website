import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import path from 'path';


// https://astro.build/config
export default defineConfig({
    integrations: [
        sitemap(),
        icon(),
        mdx()
    ],
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                '@styles': path.resolve('./src/styles/components'),
                '@components': path.resolve('./src/components'),
                '@layouts': path.resolve('./src/layouts'),
                '@assets': path.resolve('./src/assets'),
                '@scripts': path.resolve('./src/scripts/components')
            }
        }
    },
    compressHTML: true,
    output: 'static',
    build: {
        assets: '__assets'
    }
});
