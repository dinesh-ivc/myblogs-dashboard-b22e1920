/**
 * @swagger
 * /api/admin/posts:
 *   get:
 *     summary: Fetch all posts for authenticated user (admin sees all, author sees own)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || (payload.role !== 'admin' && payload.role !== 'author')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();
    let query = supabase
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
      .order('created_at', { ascending: false });

    // If author, only show their posts
    if (payload.role === 'author') {
      query = query.eq('author_id', payload.id);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: posts || []
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/admin/posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}