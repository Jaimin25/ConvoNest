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
      users: {
        every: {
          // Correct usage of 'every'
          id: {
            in: userIds
          }
        }
      }
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
    orderBy: {
      updatedAt: 'desc'
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

export async function DELETE(req: NextRequest) {
  const { chatId } = await req.json();

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

  const chat = await db.chat.findFirst({
    where: {
      id: chatId,
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

  if (chat) {
    const deleteMsg = await db.messages.deleteMany({
      where: {
        chatId: chatId
      }
    });
    if (deleteMsg) {
      await db.chat.delete({
        where: {
          id: chatId
        }
      });
      return NextResponse.json({
        statusCode: 200,
        body: {
          message: 'Chat deleted'
        }
      });
    }
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'Chat not found'
      }
    });
  }
}
