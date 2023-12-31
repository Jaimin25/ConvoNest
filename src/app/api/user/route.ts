import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

import { createSupabaseServerClient } from '../lib/supabase';

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

  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  });

  if (user) {
    return NextResponse.json({
      statusCode: 200,
      user
    });
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'User not found'
      }
    });
  }
}
