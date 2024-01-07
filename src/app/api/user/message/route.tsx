import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

import { createSupabaseServerClient } from '../../lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId') as string;
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

  const hasAccess = await db.chat.findFirst({
    where: {
      id: chatId,
      users: {
        some: {
          id: userId
        }
      }
    }
  });

  if (!hasAccess) {
    return NextResponse.json({ statusCode: 403, error: 'Forbidden' });
  }

  const messages = await db.messages.findMany({
    where: {
      chatId
    }
  });

  return NextResponse.json({ statusCode: 200, messages: messages });
}

export async function POST(req: NextRequest) {
  const { chatId, content } = await req.json();
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

  const hasAccess = await db.chat.findFirst({
    where: {
      id: chatId,
      users: {
        some: {
          id: userId
        }
      }
    }
  });

  if (!hasAccess) {
    return NextResponse.json({ statusCode: 403, error: 'Forbidden' });
  }

  const message = await db.messages.create({
    data: {
      content,
      chatId,
      userId
    }
  });

  if (message) {
    const updateChat = await db.chat.update({
      where: {
        id: chatId
      },
      data: {
        lastMessage: content
      }
    });

    if (updateChat) {
      return NextResponse.json({
        statusCode: 200,
        message: message
      });
    } else {
      return NextResponse.json({
        statusCode: 500,
        error: 'Internal Server Error'
      });
    }
  } else {
    return NextResponse.json({
      statusCode: 500,
      error: 'Internal Server Error'
    });
  }
}
