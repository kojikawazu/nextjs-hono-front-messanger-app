'use client';

import React, { useEffect, useState } from 'react';
import { Message } from '@/app/type/message.type';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL as string;

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch(`${BACKEND_URL}/api/messages`);
            const data = await res.json();

            if (data) {
                setMessages(data);
                //console.log('data:', data);
            }
        };

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
            console.debug(event.data);
            const receivedData = JSON.parse(event.data);
            const receivedMessage: Message = receivedData.messageWithUser;
            setMessages((prevMessages) => {
                if (!prevMessages.some(message => message.id === receivedMessage.id)) {
                    return [...prevMessages, receivedMessage];
                }
                return prevMessages;
            });
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


    const handleSend = async () => {
        console.debug('newMessage:', newMessage);
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newMessage,
                    userId,
                }),
            });

            console.debug('res:', res);
            if (res.ok) {
                const message = await res.json();
                //console.log('add:', JSON.stringify(message, null, 2));
                //setMessages((prevMessages) => [...prevMessages, message]);
                setNewMessage('');
            }
        } catch (err) {
            console.error('Error sending message: ', err);
        }
    };

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
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatClientWindow;