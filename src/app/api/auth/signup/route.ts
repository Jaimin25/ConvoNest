import { NextRequest, NextResponse } from 'next/server';

import { decryptValue } from '@/lib/cryptoJS';
import { db } from '@/lib/db';

import { createSupabaseServerClient } from '../../lib/supabase';

export async function POST(req: NextRequest) {
  const res = await req.json();
  const { username, email, password, location } = res;
  const originalPassword = decryptValue(password);
  const supabase = await createSupabaseServerClient();

  const user = await db.user.findUnique({
    where: {
      name: username
    }
  });

  if (!user) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: originalPassword
    });

    if (data && !error) {
      const userData = await db.user.create({
        data: {
          id: data.user?.id as string,
          name: username
        }
      });
      if (userData) {
        await db.userStats.create({
          data: {
            id: data.user?.id as string,
            name: username,
            city: location.city,
            state: location.state_prov,
            country: location.country_name
          }
        });
        return NextResponse.json({ statusCode: 200 });
      } else {
        return NextResponse.json({
          statusCode: 500,
          error: 'Internal Server Error'
        });
      }
    } else {
      return NextResponse.json({
        statusCode: 403,
        error: 'User with email already exists'
      });
    }
  } else {
    return NextResponse.json({
      statusCode: 403,
      error: 'Username already exists'
    });
  }
}
