import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { senderId, receiverId } = await req.json();

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

  const sentReq = await db.friendRequests.findFirst({
    where: {
      OR: [
        {
          senderId,
          receiverId
        },
        {
          senderId: receiverId,
          receiverId: senderId
        }
      ]
    }
  });

  if (!sentReq) {
    const res = await db.friendRequests.create({
      data: {
        senderId,
        receiverId
      }
    });

    if (res) {
      return NextResponse.json({
        statusCode: 200,
        body: {
          message: 'Friend request sent',
          data: res
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
      statusCode: 400,
      body: {
        message: 'Friend request already sent'
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

  const allRequests = await db.friendRequests.findMany({
    where: {
      OR: [
        {
          senderId: userId
        },
        {
          receiverId: userId
        }
      ]
    }
  });

  if (allRequests) {
    return NextResponse.json({
      statusCode: 200,
      requests: allRequests
    });
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'No friend requests found'
      }
    });
  }
}

export async function DELETE(req: NextRequest) {
  const { sentRequstId } = await req.json();

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

  const sentReq = await db.friendRequests.findUnique({
    where: {
      id: sentRequstId
    }
  });

  if (sentReq) {
    const cancelReq = await db.friendRequests.delete({
      where: {
        id: sentRequstId
      }
    });

    if (cancelReq) {
      return NextResponse.json({
        statusCode: 200,
        body: {
          message: 'Friend request cancelled',
          data: cancelReq
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
      statusCode: 400,
      body: {
        message: 'No friend request found'
      }
    });
  }
}
