
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {post.thumbnailUrl && (
        <Link href={`/posts/${post.slug}`} className="block aspect-[16/9] relative overflow-hidden rounded-t-lg">
          <Image
            src={post.thumbnailUrl}
            alt={`Thumbnail for ${post.title}`}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300"
            data-ai-hint={post.thumbnailAiHint || 'blog thumbnail'}
          />
        </Link>
      )}
      <CardHeader className={!post.thumbnailUrl ? "pt-6" : ""}>
        <CardTitle className="text-2xl">
          <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="px-0 text-primary">
          <Link href={`/posts/${post.slug}`}>
            Read More <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
