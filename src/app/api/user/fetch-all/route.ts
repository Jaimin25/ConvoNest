import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

import { createSupabaseServerClient } from '../../lib/supabase';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({
      statusCode: 401,
      body: {
        message: 'Unauthorized'
      }
    });
  }

  const users = await db.user.findMany({
    where: {
      NOT: {
        id: session.user.id
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (users) {
    return NextResponse.json({
      statusCode: 200,
      users
    });
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'No users found'
      }
    });
  }
}
