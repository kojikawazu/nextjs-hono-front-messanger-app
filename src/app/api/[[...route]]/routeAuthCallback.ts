import { Hono } from 'hono';
import { supabaseRouteHandleClient } from "@/lib/supabase/supabaseRouteHandleClient";
import prisma from '@/lib/prisma/prisma';

// Honoインスタンス
const auth = new Hono();

auth.get('/callback', async (c) => {
    const requestURL = new URL(c.req.url);
    const code = requestURL.searchParams.get("code");

    console.log('Callback received:', { code });

    if (code) {
        try {
            console.log('supabaseRouteHandleClient before:');
            const supabase = supabaseRouteHandleClient();
            console.log(`exchangeCodeForSession before:`, supabase.auth);
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            console.log('exchangeCodeForSession after:', { data, error });

            if (error) {
                console.error('Error exchanging code for session:', error);
                return c.json({ message: 'Failed to exchange code for session' }, { status: 500 });
            }

            const user = data?.user;
            console.log('User data:', user);

            if (user) {
                const supabaseUserId = user.id;

                console.log('Prisma Client before user check:', prisma);

                // データベースにユーザーが存在するか確認
                const existingUser = await prisma.user.findFirst({
                    where: {
                        id: supabaseUserId,
                    },
                });

                console.log('Existing user:', existingUser);

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
        } catch (err) {
            console.error('Unexpected error:', err);
            return c.json({ message: 'Internal server error', error: err }, { status: 500 });
        }
    } else {
        return c.json({ message: 'Code not privider' }, { status: 400 });
    }
});

export default auth;