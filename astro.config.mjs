import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import path from 'path';


// https://astro.build/config
export default defineConfig({
    adapter: node({
        mode: 'standalone'
    }),
    integrations: [sitemap(), icon(), mdx()],
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
    output: 'server',
    env: {
        schema: {
            SMTP_HOST: envField.string({ context: 'server', access: 'secret' }),
            SMTP_PORT: envField.number({ context: 'server', access: 'secret', default: 587 }),
            SMTP_SECURE: envField.boolean({ context: 'server', access: 'secret', default: false }),
            SMTP_USER: envField.string({ context: 'server', access: 'secret' }),
            SMTP_PASS: envField.string({ context: 'server', access: 'secret' }),
            FROM_EMAIL: envField.string({ context: 'server', access: 'secret' }),
            CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret' }),
            DEV: envField.boolean({ context: 'server', access: 'secret', default: false }),
        },
    },
    build: {
        assets: '__assets'
    },
    site: 'https://www.jswebforge.de',
});