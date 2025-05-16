
// This is a simplified in-memory store for demonstration purposes.
import { doc, getDoc, getDocs, collection, addDoc, updateDoc, deleteDoc, query, orderBy, where as firestoreWhere, limit as firestoreLimit, Timestamp } from 'firebase/firestore';
import { db } from './firebase'; // Assuming db is exported from your firebase config file
import { marked } from 'marked';

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string; // Raw Markdown content
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl?: string;
  thumbnailAiHint?: string; // Hint for AI image generation/selection
  mainImageUrl?: string;
  mainImageAiHint?: string; // Hint for AI image generation/selection
  createdByUid?: string; // UID of the user who created the post
}

// Function to generate a URL-friendly slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export async function getPosts(options?: { limit?: number; excludeSlug?: string }): Promise<Post[]> {
  const postsCollection = collection(db, 'posts');
  let q = query(postsCollection, orderBy('createdAt', 'desc'));

  const querySnapshot = await getDocs(q);
  let posts: Post[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
        thumbnailUrl: data.thumbnailUrl,
        thumbnailAiHint: data.thumbnailAiHint,
        mainImageUrl: data.mainImageUrl,
        mainImageAiHint: data.mainImageAiHint,
        createdByUid: data.createdByUid,
    };
  });

  if (options?.excludeSlug) {
    posts = posts.filter(post => post.slug !== options.excludeSlug);
  }

  if (options?.limit) {
    posts = posts.slice(0, options.limit);
  }

  return posts;
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const postDocRef = doc(db, 'posts', id);
  const postSnapshot = await getDoc(postDocRef);

  if (!postSnapshot.exists()) {
    return undefined;
  }

  const data = postSnapshot.data();
  return {
    id: postSnapshot.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    thumbnailUrl: data.thumbnailUrl,
    thumbnailAiHint: data.thumbnailAiHint,
    mainImageUrl: data.mainImageUrl,
    mainImageAiHint: data.mainImageAiHint,
    createdByUid: data.createdByUid,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, firestoreWhere('slug', '==', slug), firestoreLimit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return undefined;
  }

  const postDoc = querySnapshot.docs[0];
  const data = postDoc.data();
  return {
    id: postDoc.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    thumbnailUrl: data.thumbnailUrl,
    thumbnailAiHint: data.thumbnailAiHint,
    mainImageUrl: data.mainImageUrl,
    mainImageAiHint: data.mainImageAiHint,
    createdByUid: data.createdByUid,
  };
}

export async function addPost(data: { 
    title: string; 
    content: string; 
    thumbnailUrl?: string; 
    thumbnailAiHint?: string; 
    mainImageUrl?: string; 
    mainImageAiHint?: string;
    createdByUid: string; // Ensure this is passed
  }): Promise<Post> {
  const postsCollection = collection(db, 'posts');
  
  let currentSlug = slugify(data.title);
  let counter = 1;
  let slugQuery = query(postsCollection, firestoreWhere('slug', '==', currentSlug));
  let slugSnapshot = await getDocs(slugQuery);

  while (!slugSnapshot.empty) {
    currentSlug = `${slugify(data.title)}-${counter}`;
    counter++;
    slugQuery = query(postsCollection, firestoreWhere('slug', '==', currentSlug));
    slugSnapshot = await getDocs(slugQuery);
  }

  const now = new Date();
  const newPostDocData = {
    slug: currentSlug, 
    title: data.title,
    content: data.content,
    createdAt: Timestamp.fromDate(now), // Use Firestore Timestamp
    updatedAt: Timestamp.fromDate(now), // Use Firestore Timestamp
    thumbnailUrl: data.thumbnailUrl || `https://placehold.co/400x250.png`,
    thumbnailAiHint: data.thumbnailAiHint || 'general topic',
    mainImageUrl: data.mainImageUrl || `https://placehold.co/800x450.png`,
    mainImageAiHint: data.mainImageAiHint || 'article content',
    createdByUid: data.createdByUid, // Store the creator's UID
  };

  const newPostRef = await addDoc(postsCollection, newPostDocData);
  const newPostSnapshot = await getDoc(newPostRef); // Fetch to confirm write and get consistent data
  const finalPostData = newPostSnapshot.data()!;

  return {
    id: newPostSnapshot.id,
    slug: finalPostData.slug,
    title: finalPostData.title,
    content: finalPostData.content,
    createdAt: (finalPostData.createdAt as Timestamp).toDate(),
    updatedAt: (finalPostData.updatedAt as Timestamp).toDate(),
    thumbnailUrl: finalPostData.thumbnailUrl,
    thumbnailAiHint: finalPostData.thumbnailAiHint,
    mainImageUrl: finalPostData.mainImageUrl,
    mainImageAiHint: finalPostData.mainImageAiHint,
    createdByUid: finalPostData.createdByUid,
  };
}

export async function updatePost(id: string, data: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'createdByUid'>> & { title?: string, content?: string }): Promise<Post | undefined> {
  const postRef = doc(db, 'posts', id);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists()) {
    return undefined;
  }

  const currentPostData = postSnapshot.data();
  const updatedData: any = { ...data, updatedAt: Timestamp.fromDate(new Date()) }; // Use Firestore Timestamp

  if (data.title && data.title !== currentPostData.title) {
    const postsCollection = collection(db, 'posts');
    let newSlug = slugify(data.title);
    let counter = 1;
    
    let slugQuery = query(postsCollection, firestoreWhere('slug', '==', newSlug));
    let slugSnapshot = await getDocs(slugQuery);
    let slugExists = slugSnapshot.docs.some(doc => doc.id !== id);

    while (slugExists) {
        newSlug = `${slugify(data.title)}-${counter}`;
        counter++;
        slugQuery = query(postsCollection, firestoreWhere('slug', '==', newSlug));
        slugSnapshot = await getDocs(slugQuery);
        slugExists = slugSnapshot.docs.some(doc => doc.id !== id);
    }
    updatedData.slug = newSlug;
  } else if (data.title === undefined && !updatedData.slug) { 
    updatedData.slug = currentPostData.slug;
  }


  await updateDoc(postRef, updatedData);
  const updatedPostSnapshot = await getDoc(postRef);
  const finalPostData = updatedPostSnapshot.data()!;

  return {
    id: updatedPostSnapshot.id,
    slug: finalPostData.slug,
    title: finalPostData.title,
    content: finalPostData.content,
    createdAt: (finalPostData.createdAt as Timestamp).toDate(),
    updatedAt: (finalPostData.updatedAt as Timestamp).toDate(),
    thumbnailUrl: finalPostData.thumbnailUrl,
    thumbnailAiHint: finalPostData.thumbnailAiHint,
    mainImageUrl: finalPostData.mainImageUrl,
    mainImageAiHint: finalPostData.mainImageAiHint,
    createdByUid: finalPostData.createdByUid, // Ensure this field is returned
  };
}

export async function deletePost(id: string): Promise<void> {
  const postRef = doc(db, 'posts', id);
  await deleteDoc(postRef);
}

export function formatContentForDisplay(markdownContent: string): string {
  let html = marked(markdownContent) as string;

  // Regex to wrap explicitly signed numbers in spans
  // Handles numbers like +5, +5.5, +5bp, +5.5%
  html = html.replace(
    /(?<!&lt;|<|&quot;|'|\w-|[$\w])\+(\d*\.?\d+(?:bp|%)?)(?![-\w])/g,
    '<span class="text-positive">+$1</span>'
  );
  // Handles numbers like -5, –5, -5.5, –5.5bp, -5% (hyphen or en-dash)
  html = html.replace(
    /(?<!&lt;|<|&quot;|'|\w-|[$\w])(?:-|–)(\d*\.?\d+(?:bp|%)?)(?![-\w])/g,
    '<span class="text-negative">-$1</span>'
  );

  return html;
}

