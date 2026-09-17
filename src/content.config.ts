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
            // How the service reads mid-sentence ("Completed ___ work"). Defaults to the
            // lowercased title — set it when that would lowercase a proper noun ("Korean").
            inlineName: z.string().optional(),
            heroImage: image().optional(),
            // Defaults to "completed Earth Cone project work" — override it whenever the hero
            // is stock photography, so the alt text never claims someone else's photo as ours.
            heroAlt: z.string().optional(),
            // Licensed stock photos illustrating where a material is typically used. Rendered
            // in their own labelled section, never mixed into the portfolio gallery (which is
            // Earth Cone's own work only). Credits live in docs/project-memory.md.
            applications: z
                .array(z.object({ image: image(), title: z.string(), alt: z.string() }))
                .optional(),
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
