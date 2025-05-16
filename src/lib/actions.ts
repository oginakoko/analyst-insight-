
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateBlogTitles as generateBlogTitlesFlow } from '@/ai/flows/generate-blog-titles';
import { addPost, updatePost, deletePost as deletePostDb, Post, getPostById, slugify } from './posts';

const PostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
  thumbnailUrl: z.string().url({ message: 'Please enter a valid URL for the thumbnail.' }).optional().or(z.literal('')),
  thumbnailAiHint: z.string().max(50, { message: 'Thumbnail AI hint too long.'}).optional(), // Max 2 words roughly
  mainImageUrl: z.string().url({ message: 'Please enter a valid URL for the main image.' }).optional().or(z.literal('')),
  mainImageAiHint: z.string().max(50, { message: 'Main image AI hint too long.'}).optional(),
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
    return { error: 'Failed to generate titles. Please try again.' };
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
    // Ensure default placeholders if URLs are empty strings but hints might exist
    const data = validatedFields.data;
    const postData = {
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl || 'https://placehold.co/400x250.png',
        thumbnailAiHint: data.thumbnailAiHint || (data.thumbnailUrl ? slugify(data.title).substring(0,20) : 'general topic'),
        mainImageUrl: data.mainImageUrl || 'https://placehold.co/800x450.png',
        mainImageAiHint: data.mainImageAiHint || (data.mainImageUrl ? slugify(data.title).substring(0,20) : 'article content'),
    };

    const newPost = await addPost(postData);
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/posts/${newPost.slug}`);
    
  } catch (e) {
    console.error('Error creating post:', e);
    return { message: 'Database Error: Failed to Create Post.' };
  }
  redirect('/admin/posts');
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
    // Prepare data for update, ensuring optional fields are handled
    const postUpdateData: Partial<Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>> & { title?: string, content?: string } = {
        title: data.title,
        content: data.content,
    };
    if (data.thumbnailUrl || data.thumbnailUrl === '') { // Allow clearing URL
        postUpdateData.thumbnailUrl = data.thumbnailUrl || 'https://placehold.co/400x250.png';
    }
    if (data.thumbnailAiHint || data.thumbnailAiHint === '') {
        postUpdateData.thumbnailAiHint = data.thumbnailAiHint || (postUpdateData.thumbnailUrl !== 'https://placehold.co/400x250.png' ? slugify(data.title || '').substring(0,20) : 'general topic');
    }
     if (data.mainImageUrl || data.mainImageUrl === '') {
        postUpdateData.mainImageUrl = data.mainImageUrl || 'https://placehold.co/800x450.png';
    }
    if (data.mainImageAiHint || data.mainImageAiHint === '') {
        postUpdateData.mainImageAiHint = data.mainImageAiHint || (postUpdateData.mainImageUrl !== 'https://placehold.co/800x450.png' ? slugify(data.title || '').substring(0,20) : 'article content');
    }


    const updatedPost = await updatePost(id, postUpdateData);
    if (!updatedPost) {
      return { message: 'Error: Post not found.' };
    }
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/admin/posts/${id}/edit`);
    revalidatePath(`/posts/${updatedPost.slug}`);
    
  } catch (e) {
    console.error('Error updating post:', e);
    return { message: 'Database Error: Failed to Update Post.' };
  }
  redirect('/admin/posts');
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
    return { success: true, message: 'Post deleted successfully.' };
  } catch (e) {
    console.error('Error deleting post:', e);
    return { success: false, message: 'Database Error: Failed to Delete Post.' };
  }
}
