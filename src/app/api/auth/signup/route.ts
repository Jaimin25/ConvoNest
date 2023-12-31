import { NextRequest, NextResponse } from "next/server";

import { decryptValue } from "@/lib/cryptoJS";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function POST(req: NextRequest) {
    const { username, email, password } = await req.json();
    const originalPassword = decryptValue(password);
    const supabase = await createSupabaseServerClient();

    const user = await db.user.findUnique({
        where: {
            name: username,
        },
    });

    if (!user) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: originalPassword,
        });

        if (data && !error) {
            const userData = await db.user.create({
                data: {
                    id: data.user?.id as string,
                    name: username,
                },
            });
            if (userData) {
                return NextResponse.json({ statusCode: 200 });
            } else {
                return NextResponse.json({
                    statusCode: 500,
                    error: "Internal Server Error",
                });
            }
        } else {
            return NextResponse.json({
                statusCode: 400,
                error: "User with email already exists",
            });
        }
    } else {
        return NextResponse.json({
            statusCode: 400,
            error: "Username already exists",
        });
    }
}
