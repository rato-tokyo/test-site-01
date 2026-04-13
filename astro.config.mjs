// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import remarkDirective from 'remark-directive';
import { remarkNobitenDirectives } from './src/lib/remark-nobiten-directives.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	// server mode: WeekCalendar 等の動的コンポーネント用。
	// 本番デプロイ先は Cloudflare Pages を想定。静的ページは Astro が自動で prerender する。
	output: 'server',
	adapter: cloudflare(),
	integrations: [mdx(), sitemap(), react()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		remarkPlugins: [remarkDirective, remarkNobitenDirectives],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
