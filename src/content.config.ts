import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            summary: z.string(),
            order: z.number(),
            heroImage: image().optional(),
        }),
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        order: z.number(),
        // Directory name under src/images/ this category's media lives in.
        folder: z.string(),
        // Matching entry id in the `services` collection, for cross-linking.
        serviceSlug: z.string().optional(),
        // Basename (within `folder`) of the media item to use as this category's homepage
        // teaser cover — curated so the cover is always a sharp photo, never whichever file
        // happens to sort first alphabetically (which can land on a blurry video-frame poster).
        cover: z.string().optional(),
    }),
});

export const collections = { services, projects };
