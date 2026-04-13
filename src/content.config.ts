import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	// 旧記事(pubDate/updatedDate)と新記事(publishedAt/updatedAt)の両記法を受け入れ、
	// 読み込み後は pubDate/updatedDate に正規化する。
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				pubDate: z.coerce.date().optional(),
				publishedAt: z.coerce.date().optional(),
				updatedDate: z.coerce.date().optional(),
				updatedAt: z.coerce.date().optional(),
				heroImage: z.optional(image()),
				keywords: z.array(z.string()).optional(),
				category: z.string().optional(),
				draft: z.boolean().optional().default(false),
			})
			.transform((data) => ({
				...data,
				pubDate: data.pubDate ?? data.publishedAt,
				updatedDate: data.updatedDate ?? data.updatedAt,
			}))
			.refine((data) => data.pubDate !== undefined, {
				message: 'pubDate または publishedAt のいずれかが必須です',
				path: ['pubDate'],
			}),
});

export const collections = { blog };
