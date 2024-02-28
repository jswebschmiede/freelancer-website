import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
            image: image(),
            image_alt: z.string(),
            isFeatured: z.boolean()
        })
});

export const collections = {
    projects: projectsCollection
};
