// ESLint flat config for test-site-01
//
// 目的: Tailwind クラスの任意値 (arbitrary value `p-[17px]` 等) を機械的に禁止する。
// 対象: .astro / .ts / .tsx / .js / .jsx
// トークン設計の単一ソース: ../../docs/design-system/tokens.md

import tseslint from 'typescript-eslint';
import astroParser from 'astro-eslint-parser';
import betterTailwind from 'eslint-plugin-better-tailwindcss';

/** @type {import('eslint').Linter.Config[]} */
export default [
	// グローバル ignores
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'.astro/**',
			'.wrangler/**',
			'public/**',
		],
	},

	// .astro ファイル向け: astro-eslint-parser で解析
	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.astro'],
			},
		},
		plugins: {
			'better-tailwindcss': betterTailwind,
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: 'src/styles/global.css',
			},
		},
		rules: {
			// 任意値を一律禁止(1 クラス内に `[...]` が含まれるものを検出)
			// 例外: arbitrary variants(`[&>svg]:w-4` 等)は検出対象外
			'better-tailwindcss/no-restricted-classes': [
				'error',
				{
					restrict: [
						{
							pattern: '^(?!\\[).*-\\[.+\\]$',
							message: 'Tailwind の任意値 (arbitrary value) は禁止されています。docs/design-system/tokens.md のトークンを使うか、必要なら @theme に追加してください。',
						},
					],
				},
			],
			// よくある崩れの検出
			'better-tailwindcss/no-duplicate-classes': 'error',
			'better-tailwindcss/no-unnecessary-whitespace': 'warn',
			'better-tailwindcss/no-conflicting-classes': 'error',
			'better-tailwindcss/no-deprecated-classes': 'error',
		},
	},

	// .ts / .tsx / .js / .jsx 向け
	{
		files: ['**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}'],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'better-tailwindcss': betterTailwind,
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: 'src/styles/global.css',
			},
		},
		rules: {
			'better-tailwindcss/no-restricted-classes': [
				'error',
				{
					restrict: [
						{
							pattern: '^(?!\\[).*-\\[.+\\]$',
							message: 'Tailwind の任意値 (arbitrary value) は禁止されています。docs/design-system/tokens.md のトークンを使うか、必要なら @theme に追加してください。',
						},
					],
				},
			],
			'better-tailwindcss/no-duplicate-classes': 'error',
			'better-tailwindcss/no-unnecessary-whitespace': 'warn',
			'better-tailwindcss/no-conflicting-classes': 'error',
			'better-tailwindcss/no-deprecated-classes': 'error',
		},
	},
];
