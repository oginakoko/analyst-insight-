
'use client';

import { useEffect, useState, useActionState } from 'react'; // Changed import
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SparklesIcon, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/posts';
import type { FormState } from '@/lib/actions';
import { generateTitlesAction } from '@/lib/actions';
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
  // Updated to use React.useActionState
  const [formState, formAction] = useActionState(action, initialState);

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [titleGenerationError, setTitleGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (formState?.message && !formState.errors && formState.post) { // Successfully created/updated
        toast({
            title: "Success!",
            description: formState.message,
            variant: "default",
        });
        // Redirect is handled by the server action itself
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
            <Label htmlFor="content">Content</Label>
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

          <div className="space-y-4">
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
      {formState?.message && !formState.errors && !formState.post && ( // General error not tied to fields
        <Alert variant="destructive" className="mt-4">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
