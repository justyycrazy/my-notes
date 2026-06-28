import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { DEFAULT_AUTHOR } from './consts';

const categories = defineCollection({
	loader: file('./src/content/categories.yaml'),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		order: z.number().default(0),
		parent: reference('categories').optional(),
	}),
});

const tags = defineCollection({
	loader: file('./src/content/tags.yaml'),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
	}),
});

const postSchema = z.object({
	slug: z.string().min(1).trim(),
	title: z.string().min(1).trim(),
	author: z.string().default(DEFAULT_AUTHOR),
	createTime: z.coerce.date(),
	updateTime: z.coerce.date(),
	category: reference('categories'),
	tags: z.array(reference('tags')).optional(),
	description: z.string().trim().optional(),
	password: z.string().optional(),
});

const pending = defineCollection({
	loader: glob({ base: './src/content/pending', pattern: '**/*.md' }),
	schema: postSchema,
});

const published = defineCollection({
	loader: glob({ base: './src/content/published', pattern: '**/*.md' }),
	schema: postSchema,
});

export const collections = { categories, tags, pending, published };
