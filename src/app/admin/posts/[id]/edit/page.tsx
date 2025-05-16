import { getPostById } from '@/lib/posts';
import { BlogEditorForm } from '@/components/blog/BlogEditorForm';
import { updatePostAction } from '@/lib/actions';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const updatePostActionWithId = updatePostAction.bind(null, params.id);

  return (
    <div>
      <BlogEditorForm post={post} action={updatePostActionWithId} />
    </div>
  );
}
