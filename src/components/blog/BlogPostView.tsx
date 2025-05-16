
'use client';

import type { Post } from '@/lib/posts';
import { formatContentForDisplay } from '@/lib/posts';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

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

        {post.mainImageUrl && (
          <div className="mb-8 aspect-[16/9] relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={post.mainImageUrl}
              alt={`Main image for ${post.title}`}
              layout="fill"
              objectFit="cover"
              priority // Main image on the page, so prioritize loading
              data-ai-hint={post.mainImageAiHint || 'article image'}
            />
          </div>
        )}
        
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
              <Card key={recPost.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                {recPost.thumbnailUrl && (
                   <Link href={`/posts/${recPost.slug}`} className="block aspect-[16/9] relative overflow-hidden rounded-t-lg">
                    <Image
                        src={recPost.thumbnailUrl}
                        alt={`Thumbnail for ${recPost.title}`}
                        layout="fill"
                        objectFit="cover"
                        className="hover:scale-105 transition-transform duration-300"
                        data-ai-hint={recPost.thumbnailAiHint || 'related article'}
                    />
                   </Link>
                )}
                <CardHeader className={!recPost.thumbnailUrl ? "pt-6" : ""}>
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
                <CardFooter>
                   <Link href={`/posts/${recPost.slug}`} className="text-sm text-primary hover:underline">
                    Read more
                   </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
