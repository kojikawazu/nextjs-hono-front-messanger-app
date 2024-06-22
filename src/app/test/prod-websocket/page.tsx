'use client';

import React, { useEffect, useState } from 'react';
import { useChat } from '@/app/hooks/useChat';
import { Message } from '@/app/type/message.type';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL as string;
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID as string;

const ProdWebSocketTestPage  = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const {         
        newMessage, 
        setNewMessage,
        connectionStatus,
        setConnectionStatus,
    } = useChat(TEST_USER_ID);

  useEffect(() => {
    // [WebSocket受付]
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        console.log('[Front] WebSocket connection opened');
        setConnectionStatus('WebSocket connection opened');
    };

    ws.onmessage = (event: MessageEvent) => {
        console.log('[Front] WebSocket message received:', event.data);
        const { messageWithUser } = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, messageWithUser]);
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

  const handleSendMessage = async () => {
    console.debug('newMessage:', newMessage);
    try {
        const res = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newMessage, userId: TEST_USER_ID }),
        });

        console.debug('res:', res);
        setNewMessage('');
    } catch (error) {
        console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chat Test</h1>
        <div className="mb-4">
            <p>Status: {connectionStatus}</p>
            <div className="border border-gray-300 rounded-md p-4 h-64 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index}>
                        <p><strong>{message.user.name}</strong>: {message.content}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex">
            <input
                type="text"
                value={newMessage}
                className="border border-gray-300 rounded-md p-2 flex-grow"
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white rounded-md p-2 ml-2"
                onClick={handleSendMessage}
            >
                Send
            </button>
        </div>
    </div>
  );
}

export default ProdWebSocketTestPage;