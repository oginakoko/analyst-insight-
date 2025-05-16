import { getPosts } from '@/lib/posts';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
        Latest Analysis
      </h1>
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
