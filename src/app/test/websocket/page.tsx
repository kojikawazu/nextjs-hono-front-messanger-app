'use client';

import React, { useEffect, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const SEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const SEND_URL = SEND_BASE_URL + "/api/test_messages";

/**
 * WebSocketテストページ
 * @returns JSX
 */
const WebSocketTestPage = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        // [WebSocket受付]
        const ws = new WebSocket(WS_URL);

        ws.onmessage = (event) => {
            const { message } = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        return () => ws.close();
    }, []);

    const handleSendMessage = async () => {
        await fetch(SEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newMessage }),
        });

        setNewMessage('');
    };

    return (
        <div>
            <h1>Chat Test</h1>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>

            <input
                type="text"
                value={newMessage}
                className="border border-gray-300 rounded-md p-2 w-full"
                onChange={(e) => setNewMessage(e.target.value)}
            />

            <button
                className="bg-blue-500 text-white rounded-md p-2 mt-2"
                onClick={handleSendMessage}
            >
                Send
            </button>
        </div>
    );
};

export default WebSocketTestPage;
