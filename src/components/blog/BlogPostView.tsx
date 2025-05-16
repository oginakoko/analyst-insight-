import type { Post } from '@/lib/posts';
import { formatContentForDisplay } from '@/lib/posts';

interface BlogPostViewProps {
  post: Post;
}

export function BlogPostView({ post }: BlogPostViewProps) {
  const formattedContent = formatContentForDisplay(post.content);

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{post.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>
      <div 
        className="text-foreground"
        dangerouslySetInnerHTML={{ __html: formattedContent }} 
      />
    </article>
  );
}
