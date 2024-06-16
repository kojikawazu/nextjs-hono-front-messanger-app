import React from 'react';
import AuthSignInButton from '@/app/components/auth/auth-signin-button';

/**
 * サインイン認証ページ
 * @returns JSX
 */
const AuthSignInPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Sign In
        </h2>
        <AuthSignInButton />
      </div>
    </div>
  );
}

export default AuthSignInPage;