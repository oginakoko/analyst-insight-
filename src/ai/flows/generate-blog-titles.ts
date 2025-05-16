// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview A blog title generation AI agent.
 *
 * - generateBlogTitles - A function that handles the blog title generation process.
 * - GenerateBlogTitlesInput - The input type for the generateBlogTitles function.
 * - GenerateBlogTitlesOutput - The return type for the generateBlogTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogTitlesInputSchema = z.object({
  blogContent: z
    .string()
    .describe('The content of the blog post for which titles are generated.'),
});
export type GenerateBlogTitlesInput = z.infer<typeof GenerateBlogTitlesInputSchema>;

const GenerateBlogTitlesOutputSchema = z.object({
  titles: z
    .array(z.string())
    .describe('An array of potential titles for the blog post.'),
});
export type GenerateBlogTitlesOutput = z.infer<typeof GenerateBlogTitlesOutputSchema>;

export async function generateBlogTitles(input: GenerateBlogTitlesInput): Promise<GenerateBlogTitlesOutput> {
  return generateBlogTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogTitlesPrompt',
  input: {schema: GenerateBlogTitlesInputSchema},
  output: {schema: GenerateBlogTitlesOutputSchema},
  prompt: `You are an expert blog title generator specializing in SEO optimization.

  Given the content of the blog post, generate 5 potential titles that are engaging and optimized for search engines.

  Blog Content: {{{blogContent}}}
  Titles:
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateBlogTitlesFlow = ai.defineFlow(
  {
    name: 'generateBlogTitlesFlow',
    inputSchema: GenerateBlogTitlesInputSchema,
    outputSchema: GenerateBlogTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
