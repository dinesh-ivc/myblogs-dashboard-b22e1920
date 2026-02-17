import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AppBar from '@/components/AppBar';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const dynamic = 'force-dynamic';

async function getPostBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        users:author_id (
          id,
          name,
          email,
          avatar_url,
          bio
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return post;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const author = post.users || {};
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Badge variant="secondary">{post.category || 'Uncategorized'}</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-200">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatar_url} alt={author.name} />
              <AvatarFallback>{author.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium text-gray-900">{author.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at}>{publishedDate}</time>
              </div>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Author Bio */}
        {author.bio && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">About the Author</h3>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={author.avatar_url} alt={author.name} />
                <AvatarFallback>{author.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{author.name}</p>
                <p className="text-gray-600 text-sm mt-1">{author.bio}</p>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}