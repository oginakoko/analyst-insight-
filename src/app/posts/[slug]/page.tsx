import { getPostBySlug } from '@/lib/posts';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${post.title} | Analyst's Insight`,
    description: post.content.substring(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <BlogPostView post={post} />
    </div>
  );
}

// Optional: If you have many posts and want to pre-render them at build time
// export async function generateStaticParams() {
//   const posts = await getPosts();
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
