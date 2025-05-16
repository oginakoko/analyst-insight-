import { BlogEditorForm } from '@/components/blog/BlogEditorForm';
import { createPostAction } from '@/lib/actions';

export default function NewPostPage() {
  return (
    <div>
      <BlogEditorForm action={createPostAction} />
    </div>
  );
}
