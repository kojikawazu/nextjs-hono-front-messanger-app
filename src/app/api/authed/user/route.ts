import { supabaseRouteHandleClient } from "@/lib/supabase/supabaseRouteHandleClient";
import { NextRequest, NextResponse } from "next/server";

// CORS許可アドレス
const CORS_ADDRESS = process.env.CORS_ADDRESS as string;

/**
 * 認証ユーザーの取得
 * @param req リクエスト
 * @returns レスポンス
 */
export async function GET(
    req: NextRequest,
) {
    const supabase = supabaseRouteHandleClient();
    const { data: {user}, error } = await supabase.auth.getUser();

    if (error) {
        const response = NextResponse.json({ status: 401, error: 'Uauthorized' });
        response.headers.set("Access-Control-Allow-Origin", CORS_ADDRESS);
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
    }

    const response = NextResponse.json({ user });
    response.headers.set("Access-Control-Allow-Origin", CORS_ADDRESS);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}