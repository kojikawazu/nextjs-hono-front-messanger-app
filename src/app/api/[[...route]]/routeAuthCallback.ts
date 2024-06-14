import { Hono } from 'hono';
import { supabaseRouteHandleClient } from "@/lib/supabase/supabaseRouteHandleClient";
import { PrismaClient } from "@prisma/client";

// Honoインスタンス
const auth = new Hono();
// PrismaClientインスタンス
const prisma = new PrismaClient();

auth.get('/callback', async (c) => {
    const requestURL = new URL(c.req.url);
    const code = requestURL.searchParams.get("code");

    if (code) {
        const supabase = supabaseRouteHandleClient();
        const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

        if (user) {
            const supabaseUserId = user.id;

            // データベースにユーザーが存在するか確認
            const existingUser = await prisma.user.findFirst({
                where: {
                    id: supabaseUserId,
                },
            });

            if (!existingUser) {
                // ユーザーが存在しない場合はデータベースに追加
                await prisma.user.create({
                    data: {
                        id: supabaseUserId,
                        email: user.email ? user.email : "",
                        fullName: user.user_metadata.full_name,
                        avatarUrl: user.user_metadata.avatar_url,
                    },
                });
            }
        }

        return c.redirect(requestURL.origin);
    } else {
        return c.json({ message: 'Code not privider' }, { status: 400 });
    }
});

export default auth;