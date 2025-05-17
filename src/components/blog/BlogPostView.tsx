
'use client';

import type { Post } from '@/lib/posts';
import { formatContentForDisplay, generatePdfContent } from '@/lib/posts';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Script from 'next/script';
import { useToast } from '@/hooks/use-toast';

interface BlogPostViewProps {
  post: Post;
  recommendedPosts?: Post[];
}

export function BlogPostView({ post, recommendedPosts }: BlogPostViewProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const { toast } = useToast();
  const [formattedContent, setFormattedContent] = useState('');

  useEffect(() => {
    setFormattedContent(formatContentForDisplay(post.content));
  }, [post.content]);
  
  const handleDownloadPdf = () => {
    // Generate PDF content
    const pdfContent = generatePdfContent(post);
    
    // Create a Blob with the HTML content
    const blob = new Blob([pdfContent], { type: 'text/html' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Load html2pdf.js library */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" 
        strategy="lazyOnload"
        onError={() => {
          toast({
            title: 'Library Load Error',
            description: 'Failed to load PDF generation library',
            variant: 'destructive'
          });
        }}
      />
      
      <article className="prose prose-lg dark:prose-invert max-w-none mx-auto p-8 backdrop-blur-lg bg-gray-50/80 dark:bg-black/30 rounded-xl shadow-lg ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300 hover:shadow-xl hover:ring-black/20 dark:hover:ring-white/20">
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

      <section className="max-w-3xl mx-auto py-8 px-4 md:px-6 text-center backdrop-blur-lg bg-gray-50/80 dark:bg-black/30 rounded-xl shadow-lg ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300 hover:shadow-xl hover:ring-black/20 dark:hover:ring-white/20">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Overall Outlook: Bullish</h2>
        <p className="text-muted-foreground mb-6">
          The confluence of strong industrial demand, persistent supply deficits, and geopolitical tensions creates a favorable environment for silver prices in 2025. Investors should monitor industrial trends, mining developments, and central bank activity for potential opportunities.
        </p>
        <Button
          onClick={handleDownloadPdf}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-6 rounded-md transition-colors"
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Article as PDF
            </>
          )}
        </Button>
      </section>


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
