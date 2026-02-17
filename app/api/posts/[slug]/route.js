/**
 * @swagger
 * /api/posts/{slug}:
 *   get:
 *     summary: Fetch a single post by slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const supabase = createAdminClient();
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

    if (error || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/posts/[slug]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}