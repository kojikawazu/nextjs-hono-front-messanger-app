'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/app/hooks/useChat';

const WS_URL      = process.env.NEXT_PUBLIC_WS_URL as string;

/**
 * Props用
 */
interface ChatClientWindowProps {
    userId: string | undefined;
};

/**
 * クライアント用チャットウィンドウ
 * @param userId ユーザーID
 * @returns JSX
 */
const ChatClientWindow = ({
    userId,
}: ChatClientWindowProps) => {
    const router = useRouter();
    if (userId === undefined) {
        router.push('/auth/signin');
    }
    

    const {         
        messages,
        newMessage, 
        setNewMessage,
        connectionStatus,
        setConnectionStatus,
        fetchMessages,
        handleSendMessage,
        setReceivedMessage,
    } = useChat(userId);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('[Front] WebSocket connection opened');
            setConnectionStatus('WebSocket connection opened');
        };

        /** WebSocket受付 */
        ws.onmessage = (event) => {
            console.log('[Front] WebSocket message received.');
            console.debug('data: ', event.data);
            const receivedData = JSON.parse(event.data);
            setReceivedMessage(receivedData.messageWithUser);
        };

        ws.onerror = (error: Event) => {
            console.error('[Front] WebSocket error:', error);
            setConnectionStatus(`WebSocket error`);
        };
    
        ws.onclose = () => {
            console.log('[Front] WebSocket connection closed');
            setConnectionStatus('WebSocket connection closed');
        };

        return () => ws.close();
    }, []);

    return (
        <div className="flex flex-col w-3/4 h-screen">
            <div className="flex items-center justify-between h-16 bg-gray-100 border-b border-gray-300 px-4">
                <h2 className="text-xl font-bold">Chat Window</h2>
                <p>Status: {connectionStatus}</p>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                <ul>
                    {messages.map((message) => (
                        <li key={message.id} className="mb-2">
                            <div className="px-4 py-2 bg-blue-100 rounded">
                                <strong>{message.user?.fullName || 'Unknown User'}:</strong> {message.content}
                                <em>({new Date(message.createdAt).toLocaleString()})</em>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="h-16 bg-gray-100 border-t border-gray-300 px-4 flex items-center sticky bottom-0">
                <input
                    type='text'
                    className="flex-grow px-4 py-2 border border-gray-300 rounded"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type your message...'
                />
                <button
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatClientWindow;