'use client';

import React, { useEffect, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL as string;
const SEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const SEND_URL = SEND_BASE_URL + "/api/test_messages";

/**
 * WebSocketテストページ
 * @returns JSX
 */
const WebSocketTestPage = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

    useEffect(() => {
        // [WebSocket受付]
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            setConnectionStatus('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const { message } = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.onerror = (error: Event) => {
            setConnectionStatus('WebSocket connection error');
        };

        ws.onclose = () => {
            setConnectionStatus('WebSocket connection closed');
        };

        return () => ws.close();
    }, []);

    const handleSendMessage = async () => {
        try {
            await fetch(SEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
            });

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
                        <p key={index}>{message}</p>
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
};

export default WebSocketTestPage;
