
'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SparklesIcon, Loader2, ImageIcon, Wand2 } from 'lucide-react'; // Added Wand2
import type { Post } from '@/lib/posts';
import type { FormState } from '@/lib/actions';
import { generateTitlesAction, generateImageAction } from '@/lib/actions'; // Added generateImageAction
import { useToast } from '@/hooks/use-toast';

interface BlogEditorFormProps {
  post?: Post;
  action: (
    prevState: FormState | undefined,
    formData: FormData
  ) => Promise<FormState>;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {label}
    </Button>
  );
}

export function BlogEditorForm({ post, action }: BlogEditorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const initialState: FormState = { message: '', errors: {} };
  const [formState, formAction] = useActionState(action, initialState);

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnailUrl || '');
  const [thumbnailAiHint, setThumbnailAiHint] = useState(post?.thumbnailAiHint || '');
  const [mainImageUrl, setMainImageUrl] = useState(post?.mainImageUrl || '');
  const [mainImageAiHint, setMainImageAiHint] = useState(post?.mainImageAiHint || '');
  
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [titleGenerationError, setTitleGenerationError] = useState<string | null>(null);

  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnailGenerationError, setThumbnailGenerationError] = useState<string | null>(null);
  const [isGeneratingMainImage, setIsGeneratingMainImage] = useState(false);
  const [mainImageGenerationError, setMainImageGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (formState?.message && !formState.errors && formState.post) { 
        toast({
            title: "Success!",
            description: formState.message,
            variant: "default",
        });
    } else if (formState?.message && formState.errors) {
        toast({
            title: "Error",
            description: formState.message,
            variant: "destructive",
        });
    }
  }, [formState, router, toast]);

  const handleGenerateTitles = async () => {
    if (!content || content.trim().length < 50) {
      setTitleGenerationError('Content is too short. Please write at least 50 characters.');
      setSuggestedTitles([]);
      return;
    }
    setIsGeneratingTitles(true);
    setTitleGenerationError(null);
    const result = await generateTitlesAction(content);
    setIsGeneratingTitles(false);
    if (result.titles) {
      setSuggestedTitles(result.titles);
    } else {
      setTitleGenerationError(result.error || 'Failed to generate titles.');
      setSuggestedTitles([]);
    }
  };

  const handleGenerateImage = async (type: 'thumbnail' | 'mainImage') => {
    const hint = type === 'thumbnail' ? thumbnailAiHint : mainImageAiHint;
    if (!hint || hint.trim() === '') {
      const errorMsg = 'Please provide an AI hint for the image.';
      if (type === 'thumbnail') setThumbnailGenerationError(errorMsg);
      else setMainImageGenerationError(errorMsg);
      return;
    }

    if (type === 'thumbnail') {
      setIsGeneratingThumbnail(true);
      setThumbnailGenerationError(null);
    } else {
      setIsGeneratingMainImage(true);
      setMainImageGenerationError(null);
    }

    const result = await generateImageAction(hint);

    if (type === 'thumbnail') setIsGeneratingThumbnail(false);
    else setIsGeneratingMainImage(false);

    if (result.imageDataUri) {
      if (type === 'thumbnail') setThumbnailUrl(result.imageDataUri);
      else setMainImageUrl(result.imageDataUri);
      toast({ title: "Image Generated!", description: `${type === 'thumbnail' ? 'Thumbnail' : 'Main image'} has been generated and URL updated.` });
    } else {
      const errorMsg = result.error || `Failed to generate ${type === 'thumbnail' ? 'thumbnail' : 'main image'}.`;
      if (type === 'thumbnail') setThumbnailGenerationError(errorMsg);
      else setMainImageGenerationError(errorMsg);
      toast({ title: "Image Generation Error", description: errorMsg, variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
        <CardDescription>
          {post ? 'Update the details of your blog post.' : 'Fill in the details to create a new blog post.'}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog post title"
              required
              className={formState?.errors?.title ? 'border-destructive' : ''}
            />
            {formState?.errors?.title && (
              <p className="text-sm text-destructive">{formState.errors.title.join(', ')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here. Use Markdown for formatting (e.g., ## Heading, **bold**)."
              rows={15}
              required
              className={`min-h-[300px] ${formState?.errors?.content ? 'border-destructive' : ''}`}
            />
            {formState?.errors?.content && (
              <p className="text-sm text-destructive">{formState.errors.content.join(', ')}</p>
            )}
          </div>

          {/* Thumbnail Section */}
          <div className="space-y-2 border p-4 rounded-md">
            <h3 className="text-lg font-medium flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-muted-foreground" />
              Thumbnail Image
            </h3>
            <div className="space-y-1">
              <Label htmlFor="thumbnailAiHint">AI Hint (1-2 words for generation)</Label>
              <Input
                id="thumbnailAiHint"
                name="thumbnailAiHint"
                value={thumbnailAiHint}
                onChange={(e) => setThumbnailAiHint(e.target.value)}
                placeholder="e.g., abstract tech"
                className={formState?.errors?.thumbnailAiHint ? 'border-destructive' : ''}
              />
              {formState?.errors?.thumbnailAiHint && (
                <p className="text-sm text-destructive">{formState.errors.thumbnailAiHint.join(', ')}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleGenerateImage('thumbnail')}
              disabled={isGeneratingThumbnail || !thumbnailAiHint.trim()}
              className="mb-2"
            >
              {isGeneratingThumbnail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Thumbnail with AI
            </Button>
            {thumbnailGenerationError && (
                <Alert variant="destructive" className="mb-2">
                    <AlertDescription>{thumbnailGenerationError}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-1">
                <Label htmlFor="thumbnailUrl">Thumbnail Image URL (or paste existing)</Label>
                <Input
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://placehold.co/400x250.png or AI generated"
                    className={formState?.errors?.thumbnailUrl ? 'border-destructive' : ''}
                />
                {formState?.errors?.thumbnailUrl && (
                <p className="text-sm text-destructive">{formState.errors.thumbnailUrl.join(', ')}</p>
                )}
            </div>
            {thumbnailUrl && thumbnailUrl.startsWith('data:image') && (
                <div className="mt-2">
                    <Label>Generated Thumbnail Preview:</Label>
                    <Image src={thumbnailUrl} alt="Generated Thumbnail" width={200} height={125} className="rounded border" data-ai-hint={thumbnailAiHint || 'generated image'}/>
                </div>
            )}
          </div>

          {/* Main Image Section */}
          <div className="space-y-2 border p-4 rounded-md">
            <h3 className="text-lg font-medium flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                Main Post Image
            </h3>
            <div className="space-y-1">
                <Label htmlFor="mainImageAiHint">AI Hint (1-2 words for generation)</Label>
                <Input
                    id="mainImageAiHint"
                    name="mainImageAiHint"
                    value={mainImageAiHint}
                    onChange={(e) => setMainImageAiHint(e.target.value)}
                    placeholder="e.g., finance growth"
                    className={formState?.errors?.mainImageAiHint ? 'border-destructive' : ''}
                />
                {formState?.errors?.mainImageAiHint && (
                    <p className="text-sm text-destructive">{formState.errors.mainImageAiHint.join(', ')}</p>
                )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleGenerateImage('mainImage')}
              disabled={isGeneratingMainImage || !mainImageAiHint.trim()}
              className="mb-2"
            >
              {isGeneratingMainImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Main Image with AI
            </Button>
            {mainImageGenerationError && (
                <Alert variant="destructive" className="mb-2">
                    <AlertDescription>{mainImageGenerationError}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-1">
                <Label htmlFor="mainImageUrl">Main Post Image URL (or paste existing)</Label>
                <Input
                    id="mainImageUrl"
                    name="mainImageUrl"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                    placeholder="https://placehold.co/800x450.png or AI generated"
                    className={formState?.errors?.mainImageUrl ? 'border-destructive' : ''}
                />
                {formState?.errors?.mainImageUrl && (
                    <p className="text-sm text-destructive">{formState.errors.mainImageUrl.join(', ')}</p>
                )}
            </div>
            {mainImageUrl && mainImageUrl.startsWith('data:image') && (
                <div className="mt-2">
                    <Label>Generated Main Image Preview:</Label>
                    <Image src={mainImageUrl} alt="Generated Main Image" width={400} height={225} className="rounded border" data-ai-hint={mainImageAiHint || 'generated image'}/>
                </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label>Title Generation</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateTitles}
              disabled={isGeneratingTitles || content.trim().length < 50}
            >
              {isGeneratingTitles ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="mr-2 h-4 w-4" />
              )}
              Generate Titles with AI
            </Button>
            {titleGenerationError && (
              <Alert variant="destructive">
                <AlertTitle>Title Generation Error</AlertTitle>
                <AlertDescription>{titleGenerationError}</AlertDescription>
              </Alert>
            )}
            {suggestedTitles.length > 0 && (
              <div className="space-y-2">
                <Label>Suggested Titles:</Label>
                <ul className="list-disc list-inside p-2 border rounded-md bg-muted/50">
                  {suggestedTitles.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => setTitle(suggestion)}
                      className="cursor-pointer hover:text-primary p-1 rounded"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton label={post ? 'Update Post' : 'Create Post'} />
        </CardFooter>
      </form>
      {formState?.message && !formState.errors && !formState.post && ( 
        <Alert variant="destructive" className="mt-4">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
