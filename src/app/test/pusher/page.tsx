'use client';

import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const WS_URL         = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const PUSHER_KEY     = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;
const SUBSCRIBE_NAME = "chat";
const BIND_NAME = "message";

/**
 * Puser用テストページ
 * @returns JSX
 */
const PusherTestPage = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    
    useEffect(() => {
        // Pusherの設定
        const pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
        });

        // チャンネルを購読
        const channel = pusher.subscribe(SUBSCRIBE_NAME);
        channel.bind(BIND_NAME, function(data: { message: string }) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        return () => {
            pusher.unsubscribe(SUBSCRIBE_NAME);
        };
    }, []);

    const handleSendMessage = async () => {
        await fetch(`${WS_URL}/api/test_messages`, {
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
            <h1>
                Chat Test
            </h1>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>

            <input
                type="text"
                value={newMessage}
                className="border border-gray-300 rounded-md p-2 w-full"
                onChange={(e) => setNewMessage(e.target.value)} />
            
            <button 
                className="bg-blue-500 text-white rounded-md p-2 mt-2"
                onClick={handleSendMessage}
            >
                Send
            </button>
        </div>
    );
}

export default PusherTestPage;