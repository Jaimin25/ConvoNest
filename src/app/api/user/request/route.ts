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
      status: 401,
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
        status: 'pending',
        senderId,
        receiverId
      }
    });

    if (res) {
      return NextResponse.json({
        statusCode: 200,
        body: {
          message: 'Friend request sent'
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
      status: 401,
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
      allRequests
    });
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'Friend request not found'
      }
    });
  }
}