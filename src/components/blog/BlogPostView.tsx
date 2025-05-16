'use client';

import type { Post } from '@/lib/posts';
import { formatContentForDisplay } from '@/lib/posts';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For styling recommendations
import { Separator } from '@/components/ui/separator';

interface BlogPostViewProps {
  post: Post;
  recommendedPosts?: Post[];
}

export function BlogPostView({ post, recommendedPosts }: BlogPostViewProps) {
  const [formattedContent, setFormattedContent] = useState('');

  useEffect(() => {
    setFormattedContent(formatContentForDisplay(post.content));
  }, [post.content]);

  return (
    <>
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
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </article>

      {recommendedPosts && recommendedPosts.length > 0 && (
        <section className="max-w-3xl mx-auto py-8 px-4 md:px-6">
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Further Reading
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedPosts.map((recPost) => (
              <Card key={recPost.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/posts/${recPost.slug}`} className="hover:text-primary transition-colors">
                      {recPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {recPost.content.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
