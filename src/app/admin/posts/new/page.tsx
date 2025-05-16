
import { BlogEditorForm } from '@/components/blog/BlogEditorForm';
import { createPostAction } from '@/lib/actions';

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <BlogEditorForm action={createPostAction} />
    </div>
  );
}
