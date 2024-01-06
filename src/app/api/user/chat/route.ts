import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

import { createSupabaseServerClient } from '../../lib/supabase';

export async function POST(req: NextRequest) {
  const { isGroup, name, adminId, userIds } = await req.json();

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

  const chatExists = await db.chat.findFirst({
    where: {
      isGroup: isGroup,
      AND: userIds.map((userId: string) => ({
        users: {
          some: {
            id: userId
          }
        }
      }))
    },
    include: {
      users: true
    }
  });

  if (!chatExists) {
    const chat = await db.chat.create({
      data: {
        isGroup,
        name,
        adminId,
        users: {
          connect: userIds.map((userId: string) => ({
            id: userId
          }))
        }
      },
      include: {
        users: true
      }
    });

    if (chat) {
      return NextResponse.json({
        statusCode: 200,
        body: {
          message: 'Chat created',
          chat
        }
      });
    } else {
      return NextResponse.json({
        statusCode: 500,
        body: {
          message: 'Something went wrong'
        }
      });
    }
  } else {
    return NextResponse.json({
      statusCode: 403,
      body: {
        message: 'Chat already exists'
      }
    });
  }
}

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

  const chats = await db.chat.findMany({
    where: {
      users: {
        some: {
          id: userId
        }
      }
    },
    include: {
      users: true
    }
  });

  if (chats) {
    return NextResponse.json({
      statusCode: 200,
      chats
    });
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'Chats not found'
      }
    });
  }
}
