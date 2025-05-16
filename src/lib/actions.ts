
'use server';

import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation'; // No longer redirecting from actions directly
import { z } from 'zod';
import { generateBlogTitles as generateBlogTitlesFlow } from '@/ai/flows/generate-blog-titles';
import { generateBlogImage as generateBlogImageFlow } from '@/ai/flows/generate-blog-image-flow';
import { addPost, updatePost, deletePost as deletePostDb, Post, getPostById, slugify } from './posts';

const PostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
  thumbnailUrl: z.string().url({ message: 'Please enter a valid URL for the thumbnail.' }).optional().or(z.literal('')),
  thumbnailAiHint: z.string().max(50, { message: 'Thumbnail AI hint too long (max 50 chars).'}).optional(),
  mainImageUrl: z.string().url({ message: 'Please enter a valid URL for the main image.' }).optional().or(z.literal('')),
  mainImageAiHint: z.string().max(50, { message: 'Main image AI hint too long (max 50 chars).'}).optional(),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    thumbnailUrl?: string[];
    thumbnailAiHint?: string[];
    mainImageUrl?: string[];
    mainImageAiHint?: string[];
  };
  post?: Post; // Return the created/updated post
};

export async function generateTitlesAction(
  blogContent: string
): Promise<{ titles?: string[]; error?: string }> {
  if (!blogContent || blogContent.trim().length < 50) {
    return { error: 'Blog content is too short to generate titles. Please provide at least 50 characters.' };
  }
  try {
    const result = await generateBlogTitlesFlow({ blogContent });
    return { titles: result.titles };
  } catch (e) {
    console.error('Error generating titles:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate titles. Details: ${errorMessage}` };
  }
}

export async function generateImageAction(
  imageHint: string
): Promise<{ imageDataUri?: string; error?: string }> {
  if (!imageHint || imageHint.trim().length === 0) {
    return { error: 'Image hint cannot be empty.' };
  }
  if (imageHint.trim().length > 100) { // Max length for hint input to flow
    return { error: 'Image hint is too long (max 100 characters).' };
  }
  try {
    const result = await generateBlogImageFlow({ imageHint });
    return { imageDataUri: result.imageDataUri };
  } catch (e) {
    console.error('Error generating image via action:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image generation.';
    return { error: `Failed to generate image: ${errorMessage}` };
  }
}

export async function createPostAction(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    thumbnailUrl: formData.get('thumbnailUrl'),
    thumbnailAiHint: formData.get('thumbnailAiHint'),
    mainImageUrl: formData.get('mainImageUrl'),
    mainImageAiHint: formData.get('mainImageAiHint'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to create post. Please check the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    const postData = {
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl || 'https://placehold.co/400x250.png',
        thumbnailAiHint: data.thumbnailAiHint || (data.thumbnailUrl && data.thumbnailUrl !== 'https://placehold.co/400x250.png' ? slugify(data.title).substring(0,20) : 'general topic'),
        mainImageUrl: data.mainImageUrl || 'https://placehold.co/800x450.png',
        mainImageAiHint: data.mainImageAiHint || (data.mainImageUrl && data.mainImageUrl !== 'https://placehold.co/800x450.png' ? slugify(data.title).substring(0,20) : 'article content'),
    };

    const newPost = await addPost(postData);
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/posts/${newPost.slug}`);
    
    return { message: 'Post created successfully!', post: newPost };
  } catch (e) {
    console.error('Error creating post:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Database Error: Failed to Create Post. Details: ${errorMessage}` };
  }
}

export async function updatePostAction(
  id: string,
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    thumbnailUrl: formData.get('thumbnailUrl'),
    thumbnailAiHint: formData.get('thumbnailAiHint'),
    mainImageUrl: formData.get('mainImageUrl'),
    mainImageAiHint: formData.get('mainImageAiHint'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to update post. Please check the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    const postUpdateData: Partial<Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>> & { title?: string, content?: string } = {
        title: data.title,
        content: data.content,
    };
    if (data.thumbnailUrl || data.thumbnailUrl === '') { 
        postUpdateData.thumbnailUrl = data.thumbnailUrl || 'https://placehold.co/400x250.png';
    }
    if (data.thumbnailAiHint || data.thumbnailAiHint === '') {
        postUpdateData.thumbnailAiHint = data.thumbnailAiHint || (postUpdateData.thumbnailUrl && postUpdateData.thumbnailUrl !== 'https://placehold.co/400x250.png' ? slugify(data.title || '').substring(0,20) : 'general topic');
    }
     if (data.mainImageUrl || data.mainImageUrl === '') {
        postUpdateData.mainImageUrl = data.mainImageUrl || 'https://placehold.co/800x450.png';
    }
    if (data.mainImageAiHint || data.mainImageAiHint === '') {
        postUpdateData.mainImageAiHint = data.mainImageAiHint || (postUpdateData.mainImageUrl && postUpdateData.mainImageUrl !== 'https://placehold.co/800x450.png' ? slugify(data.title || '').substring(0,20) : 'article content');
    }

    const updatedPost = await updatePost(id, postUpdateData);
    if (!updatedPost) {
      return { message: 'Error: Post not found.' };
    }
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/admin/posts/${id}/edit`);
    revalidatePath(`/posts/${updatedPost.slug}`);
    
    return { message: 'Post updated successfully!', post: updatedPost };
  } catch (e) {
    console.error('Error updating post:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Database Error: Failed to Update Post. Details: ${errorMessage}` };
  }
}

export async function deletePostAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const existingPost = await getPostById(id);
    if (!existingPost) {
        return { success: false, message: 'Post not found.' };
    }
    await deletePostDb(id);
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/posts/${existingPost.slug}`); // Also revalidate the deleted post's public page
    return { success: true, message: 'Post deleted successfully.' };
  } catch (e) {
    console.error('Error deleting post:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Database Error: Failed to Delete Post. Details: ${errorMessage}` };
  }
}

