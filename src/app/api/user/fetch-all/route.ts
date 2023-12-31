import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function GET() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({
            status: 401,
            body: {
                message: "Unauthorized",
            },
        });
    }

    const users = await db.user.findMany({});

    return NextResponse.json({
        statusCode: 200,
        users,
    });
}
