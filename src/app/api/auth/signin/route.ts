import { NextRequest, NextResponse } from "next/server";

import { decryptValue } from "@/lib/cryptoJS";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    const originalPassword = decryptValue(password);
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: originalPassword,
    });

    if (data && !error) {
        return NextResponse.json({ statusCode: 200 });
    } else {
        return NextResponse.json({ statusCode: 400, error: error?.message });
    }
}
