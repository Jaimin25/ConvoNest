import { NextRequest, NextResponse } from 'next/server';

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

  const userId = session.user.id;

  const contacts = await db.friends.findMany({
    where: {
      user1Id: userId
    }
  });

  if (contacts) {
    return NextResponse.json({
      statusCode: 200,
      contacts
    });
  } else {
    return NextResponse.json({
      statusCode: 404,
      body: {
        message: 'No contacts found'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  const { requestId, senderId, receiverId } = await req.json();

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

  const isFriends = await db.friends.findFirst({
    where: {
      OR: [
        {
          user1Id: senderId,
          user2Id: receiverId
        },
        {
          user1Id: receiverId,
          user2Id: senderId
        }
      ]
    }
  });

  if (!isFriends) {
    const friendOne = await db.friends.create({
      data: {
        user1Id: senderId,
        user2Id: receiverId
      }
    });

    if (friendOne) {
      const friendTwo = await db.friends.create({
        data: {
          user1Id: receiverId,
          user2Id: senderId
        }
      });

      if (friendTwo) {
        const deleteRequest = await db.friendRequests.delete({
          where: {
            id: requestId
          }
        });

        if (deleteRequest) {
          return NextResponse.json({
            statusCode: 200,
            body: {
              message: 'Friend request accepted',
              data: friendOne
            }
          });
        } else {
          return NextResponse.json({
            statusCode: 500,
            body: {
              message: 'Internal server error'
            }
          });
        }
      }
    } else {
      return NextResponse.json({
        statusCode: 500,
        body: {
          message: 'Internal server error'
        }
      });
    }
  } else {
    return NextResponse.json({
      statusCode: 400,
      body: {
        message: 'Already friends'
      }
    });
  }
}
