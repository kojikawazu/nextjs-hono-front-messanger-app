import React from 'react';
import { supabaseServer } from '@/lib/supabase/supabase-server';
import ChatClientWindow from '@/app/components/chat/chat-client-window';

/**
 * サーバー用チャットウィンドウ 
 * @returns JSX
 */
const ChatServerWindow = async () => {
    const supabase = supabaseServer();
    const { data: {user} } = await supabase.auth.getUser();

    return (
        <ChatClientWindow userId={user?.id} />
    );
}

export default ChatServerWindow;