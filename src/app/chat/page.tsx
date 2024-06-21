import React from 'react';
import ChatServerWindow from '@/app/components/chat/chat-server-window';

/**
 * チャットインデックスページ
 * @returns JSX
 */
const ChatIndexPage = async () => {
    return (
        <div className="container mx-auto h-screen">
            <h1>Messanger App</h1>
            <ChatServerWindow />
        </div>
    );
}

export default ChatIndexPage;