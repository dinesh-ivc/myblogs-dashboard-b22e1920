import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BlogCard({ post }) {
  const author = post.users || {};
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Unknown date';

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {post.featured_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="mb-2">
            <Badge variant="secondary">{post.category || 'Uncategorized'}</Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 line-clamp-3">
            {post.excerpt || post.content?.substring(0, 150) + '...'}
          </p>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar_url} alt={author.name} />
              <AvatarFallback>{author.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span>{author.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.published_at}>{publishedDate}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}