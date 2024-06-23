'use client';

import { useState } from "react";
import { Message } from '@/app/type/message.type';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

/**
 * Chat用Hooks
 * @param userId　ユーザーID 
 * @returns hooks
 */
export const useChat = (userId: string | undefined) => {
    const [messages, setMessages]                 = useState<Message[]>([]);
    const [newMessage, setNewMessage]             = useState('');
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

    /**
     * メッセージ取得
     */
    const fetchMessages = async () => {
        const res  = await fetch(`${BACKEND_URL}/api/messages`);
        const data = await res.json();

        if (data) {
            setMessages(data);
            //console.log('data:', data);
        }
    };

    /**
     * メッセージ送信
     * @returns なし
     */
    const handleSendMessage = async () => {
        console.log('handleSend start...');
        console.debug('newMessage:', newMessage);
        if (!newMessage.trim()) return;

        try {
            console.log('fetch start...');
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

            console.log(`fetch end. res.ok? : ${res.ok}`);
            if (res.ok) {
                const message = await res.json();
                setNewMessage('');
            }
        } catch (err) {
            console.error('Error sending message: ', err);
        }
    };

     /**
     * メッセージ更新
     * @param messageId メッセージID
     * @param newContent 新しいメッセージ内容
     */
     const handleUpdateMessage = async (messageId: string, newContent: string) => {
        console.log('handleUpdateMessage start...');
        const url = `${BACKEND_URL}/api/messages/${messageId}`;
        console.log('Request URL:', url);

        try {
            console.log('fetch start...');
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newContent }),
            });

            console.log(`fetch end. res.ok? : ${res.ok}`);
            console.log('handleUpdateMessage end.');
        } catch (err) {
            console.error('Error updating message: ', err);
        }
    };

    /**
     * メッセージ削除
     * @param messageId メッセージID
     */
    const handleDeleteMessage = async (messageId: string) => {
        console.log('handleDeleteMessage start...');
        console.debug('messageId: ', messageId);
        const url = `${BACKEND_URL}/api/messages/${messageId}`;
        console.log('Request URL:', url);

        try {
            console.log('fetch start...');
            const res = await fetch(url, {
                method: 'DELETE',
            });

            console.log(`fetch end. res.ok? : ${res.ok}`);
            console.log('handleDeleteMessage end.');
        } catch (err) {
            console.error('Error deleting message: ', err);
        }
    };

    /**
     * メッセージを格納
     * @param messageWithUser メッセージ 
     */
    const setReceivedMessage = (messageWithUser: Message) => {
        const receivedMessage: Message = messageWithUser;
        setMessages((prevMessages) => {
            if (!prevMessages.some(message => message.id === receivedMessage.id)) {
                return [...prevMessages, receivedMessage];
            }
            return prevMessages;
        });
    }

    return { 
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
    };
}