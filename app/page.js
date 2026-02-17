import { createClient } from '@/lib/supabase/server';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogHero from '@/components/blog/BlogHero';
import AppBar from '@/components/AppBar';

export const dynamic = 'force-dynamic';

async function getPublishedPosts() {
  try {
    const supabase = await createClient();
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users:author_id (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error('Error in getPublishedPosts:', error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <BlogHero />
      <main className="container mx-auto px-4 py-12">
        <BlogGrid posts={posts} />
      </main>
    </div>
  );
}