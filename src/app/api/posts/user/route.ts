import db from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async (request: NextRequest) => {
  const posts = await db.post.findMany();

  console.log('posts fetched');
  return Response.json({ posts });
};
