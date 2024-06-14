'use client';
import React, { useState, useEffect } from 'react';

/**
 * テストページ(接続確認用)
 * @returns JSX
 */
const TestPage = () => {
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        fetch('/api/hello')
            .then((res) => res.json())
            .then((data) => setMessage(data.message));
    }, []);
  
    return (
    <div>
        <h1>Next.js + Hono</h1>
        <p>{message}</p>
    </div>
  );
};

export default TestPage;