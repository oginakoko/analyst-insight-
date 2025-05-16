'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateBlogTitles as generateBlogTitlesFlow } from '@/ai/flows/generate-blog-titles';
import { addPost, updatePost, deletePost as deletePostDb, Post, getPostById } from './posts';

const PostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
  };
  post?: Post;
  suggestedTitles?: string[];
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
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to create post. Please check the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newPost = await addPost(validatedFields.data);
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/posts/${newPost.slug}`);
    // Instead of redirecting from action, return success and redirect in component or use new useFormState hook features
    // For now, we'll return a success message and the component can redirect.
    // Or, simply redirect here if that's preferred.
  } catch (e) {
    console.error('Error creating post:', e);
    return { message: 'Database Error: Failed to Create Post.' };
  }
  redirect('/admin/posts');
  // return { message: "Post created successfully!", post: newPost }; // This won't be reached due to redirect
}

export async function updatePostAction(
  id: string,
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to update post. Please check the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const updatedPost = await updatePost(id, validatedFields.data);
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
    // No need to revalidate individual post page as it's deleted.
    return { success: true, message: 'Post deleted successfully.' };
  } catch (e) {
    console.error('Error deleting post:', e);
    return { success: false, message: 'Database Error: Failed to Delete Post.' };
  }
}
