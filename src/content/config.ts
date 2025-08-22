import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			tags: z.array(z.string()),
			image: image(),
			thumbnail: image().optional(),
			image_alt: z.string(),
			isFeatured: z.boolean(),
			website: z.string().optional(),
			date: z.string()
		})
});

export const collections = {
	projects: projectsCollection
};
