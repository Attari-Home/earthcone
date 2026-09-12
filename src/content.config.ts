import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        order: z.number(),
        heroImage: z.string().optional(),
    }),
});

export const collections = { services };
