
'use server';
/**
 * @fileOverview An AI agent for generating blog post images.
 *
 * - generateBlogImage - A function that handles blog image generation.
 * - GenerateBlogImageInput - The input type for the generateBlogImage function.
 * - GenerateBlogImageOutput - The return type for the generateBlogImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogImageInputSchema = z.object({
  imageHint: z
    .string()
    .describe('A 1-2 word hint or a short phrase describing the desired image. e.g., "abstract technology", "forest landscape", "business meeting"'),
});
export type GenerateBlogImageInput = z.infer<typeof GenerateBlogImageInputSchema>;

const GenerateBlogImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe("The generated image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateBlogImageOutput = z.infer<typeof GenerateBlogImageOutputSchema>;

export async function generateBlogImage(input: GenerateBlogImageInput): Promise<GenerateBlogImageOutput> {
  return generateBlogImageFlow(input);
}

// IMPORTANT: Only specific Gemini models support image generation.
// We are using 'googleai/gemini-2.0-flash-exp' as per guidelines.
const imageGenerationModel = 'googleai/gemini-2.0-flash-exp';

const generateBlogImageFlow = ai.defineFlow(
  {
    name: 'generateBlogImageFlow',
    inputSchema: GenerateBlogImageInputSchema,
    outputSchema: GenerateBlogImageOutputSchema,
  },
  async (input) => {
    const { imageHint } = input;

    try {
      const {media} = await ai.generate({
        model: imageGenerationModel,
        prompt: `Generate a visually appealing and relevant blog post image suitable for a thumbnail or main article illustration. The image should be inspired by the following theme or keywords: "${imageHint}". Ensure the image is safe for all audiences.`,
        config: {
          // IMPORTANT: Must request both TEXT and IMAGE for image generation with this model.
          responseModalities: ['TEXT', 'IMAGE'], 
          // Optional: Adjust safety settings if needed, though defaults are usually fine.
          // safetySettings: [
          //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          // ],
        },
      });

      if (media && media.url) {
        return { imageDataUri: media.url };
      } else {
        throw new Error('Image generation did not return a valid media URL.');
      }
    } catch (error) {
      console.error('Error generating image with Genkit:', error);
      // It's good practice to check the error structure from Gemini if issues occur.
      // For example, if there's a safety block or other specific error from the model.
      let errorMessage = 'Failed to generate image.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Consider how to propagate more specific errors if needed.
      // For now, rethrow a generic error or handle specific cases.
      throw new Error(`AI image generation failed: ${errorMessage}`);
    }
  }
);
