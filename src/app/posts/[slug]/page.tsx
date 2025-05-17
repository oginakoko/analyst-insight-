import { getPostBySlug, getPosts, Post } from '@/lib/posts';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params?.slug) {
    return {
      title: 'Invalid Post URL',
    };
  }

  try {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }
  return {
    title: `${post.title} | Analyst's Insight`,
    description: post.content.substring(0, 160), // Consider a more robust excerpt generation
  };
  } catch (error) {
    console.error('Error fetching post metadata:', error);
    return {
      title: 'Error Loading Post',
      description: 'There was an error loading this post.'
    };
  }
}

export default async function PostPage({ params }: Props) {
  if (!params?.slug) {
    notFound();
  }

  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    // Fetch other posts for recommendations, excluding the current one, limit to 3
    const recommendedPosts = await getPosts({ limit: 3, excludeSlug: post.slug });

    return (
      <div className="container mx-auto px-4 md:px-6">
        <BlogPostView post={post} recommendedPosts={recommendedPosts} />
      </div>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}

// Optional: If you have many posts and want to pre-render them at build time
// export async function generateStaticParams() {
//   const allPosts = await getPosts(); // Fetch all posts without limit or exclusion
//   return allPosts.map((p) => ({
//     slug: p.slug,
//   }));
// }
