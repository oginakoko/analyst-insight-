import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePenLine, PlusCircle } from 'lucide-react';
import { DeletePostButton } from '@/components/admin/DeletePostButton';

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Blog Posts</CardTitle>
          <CardDescription>View, edit, or delete your blog posts.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No posts found. Create your first post!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <Link href={`/posts/${post.slug}`} className="hover:text-primary" target="_blank" rel="noopener noreferrer">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <FilePenLine className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
