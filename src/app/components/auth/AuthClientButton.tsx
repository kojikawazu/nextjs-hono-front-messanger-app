"use client";

import React from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * クライアント用認証ボタンProps
 */
interface AuthClientButtonProps {
    session: { user: User } | null;
}

/**
 * クライアント用認証ボタン
 * @param session
 * @returns JSX
 */
const AuthClientButton = ({
    session
}: AuthClientButtonProps) => {
    const router = useRouter();

    const handleSignIn = async () => {
        router.push('/auth/signin');
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    return (
        <>
            {session ? (
                <Button onClick={handleSignOut}>サインアウト</Button>
            ) : (
                <Button onClick={handleSignIn}>サインイン</Button>
            )}
        </>
    );
}

export default AuthClientButton