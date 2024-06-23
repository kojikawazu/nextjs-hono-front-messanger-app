'use client';

import React, { useEffect, useState } from 'react';
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

    const [isEditing, setIsEditing]     = useState<string | null>();
    const [editMessage, setEditMessage] = useState<string>('');

    const {         
        messages,
        setMessages,
        newMessage, 
        setNewMessage,
        connectionStatus,
        setConnectionStatus,
        fetchMessages,
        handleSendMessage,
        handleUpdateMessage,
        handleDeleteMessage,
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

            if (receivedData.action === 'sendMessage') {
                console.debug('[Front] sendMessage.');
                setReceivedMessage(receivedData.message);
            } else if (receivedData.action === 'updateMessage') {
                console.debug('[Front] updateMessage.');
                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message.id === receivedData.message.id ? receivedData.message : message
                    )
                );
            } else if (receivedData.action === 'deleteMessage') {
                console.debug('[Front] deleteMessage.');
                setMessages((prevMessages) =>
                    prevMessages.filter((message) => message.id !== receivedData.messageId));
            } 
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

    const handleEditClick = (messageId: string, currentContent: string) => {
        setIsEditing(messageId);
        setEditMessage(currentContent);
    }

    const handleUpdateClick = async (messageId: string) => {
        await handleUpdateMessage(messageId, editMessage);
        setIsEditing(null);
        setEditMessage('');
    }

    return (
        <div className="flex flex-col w-full h-screen bg-gray-900 text-white">
            <div className="flex items-center justify-between h-16 border-b border-gray-600 px-4">
                <h2 className="text-xl font-bold">Chat Window</h2>
                <p>Status: {connectionStatus}</p>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                <ul>
                    {messages.map((message) => (
                        <li 
                            key={message.id} 
                            className={`mb-2 flex flex-row ${message.user?.id === userId ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex flex-col group">
                                <div className="flex text-slate-300 text-sm">
                                    <strong className="ml-2">{message.user?.fullName || 'Unknown User'}</strong>
                                    <em>({new Date(message.createdAt).toLocaleString()})</em>
                                </div>

                                <div className={`flex ${message.user?.id === userId ? 'justify-end' : 'justify-start'}`}>
                                    {message.user?.id === userId && (
                                        <div className="flex space-x-s">
                                            {isEditing === message.id.toString() ? (
                                                <>
                                                    <button 
                                                        className="px-2 py-1 mr-2 bg-gray-500 rounded-full"
                                                        onClick={() => handleUpdateClick(message.id.toString())}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 mr-2 bg-gray-500 rounded-full"
                                                        onClick={() => setIsEditing(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="px-2 py-1 mr-2 bg-gray-500 rounded-full hidden group-hover:block"
                                                        onClick={() => handleEditClick(message.id.toString(), message.content)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 mr-2 bg-gray-500 rounded-full hidden group-hover:block"
                                                        onClick={() => handleDeleteMessage(message.id.toString())}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div className={`px-6 py-3 rounded-t-full rounded-l-full max-w-xs lg:max-w-md ${message.user?.id === userId ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                        {isEditing === message.id.toString() ? (
                                            <input 
                                                type="text"
                                                placeholder="Please edit..."
                                                value={editMessage}
                                                className="px-2 py-1 rounded bg-blue-600 border"
                                                onChange={(e) => setEditMessage(e.target.value)}
                                            />                                    
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="h-16 bg-gray-100 border-t border-gray-300 px-4 flex items-center sticky bottom-0">
                <input
                    type='text'
                    className="flex-grow px-4 py-2 border border-gray-300 rounded text-black"
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