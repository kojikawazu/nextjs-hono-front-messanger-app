import React from 'react';
import { supabaseServer } from '@/lib/supabase/supabaseServer';
import ChatClientWindow from '@/app/components/chat/ChatClientWindow';

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