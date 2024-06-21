'use client';

import React from 'react';
import { supabase } from '@/lib/supabase/supabase-client';
import { Button } from '@/components/ui/button';

/**
 * サインイン認証ボタンコンポーネント
 * @returns JSX
 */
const AuthSignInButton = () => {

    const handleSignIn = async (
        provider: 'google' | 'github',
    ) => {

        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/api/auth/callback`,
            }
        });
    }

    return (
        <div className="flex flex-col items-center">
            <Button 
                onClick={() => handleSignIn('google')}
                className="mb-4 w-full"
            >
                Google
            </Button>
            <Button 
                onClick={() => handleSignIn('github')}
                className="w-full"
            >
                GitHub
            </Button>
        </div>
    );
}

export default AuthSignInButton;