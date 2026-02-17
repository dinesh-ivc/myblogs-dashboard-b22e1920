import BlogCard from './BlogCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BlogGrid({ posts = [] }) {
  if (!posts || posts.length === 0) {
    return (
      <Alert>
        <AlertDescription>No blog posts found. Check back later for new content!</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}